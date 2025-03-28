import type { Request, Response } from "express"

import { asyncHandler } from "../utils/AsyncHandler.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Chat } from "../models/chat.model.js"
import logger from "../utils/logger.js"
import mongoose from "mongoose"
import { Message } from "../models/message.model.js"

/**
 * @desc    Create a new chat if it doesn't exist or return the existing chat.
 *          If the chat exists but has a different admin, update the admin.
 * @route   POST /api/v1/chat/create
 * @access  Private
 *
 * @param {Request} req - Express request object containing chat details (admin, users)
 * @param {Response} res - Express response object to return chat details
 */
const createChat = asyncHandler(async (req: Request, res: Response) => {
  const { admin, users } = await req.body

  let chat = await Chat.findOne({
    users: {
      $all: users,
      $size: users.length,
    },
  })

  if (chat) {
    if (chat.admin !== admin) {
      chat.admin = admin
    }
    const deletedParticipants = chat.deletedBy.filter(
      (user) => user.toString() !== admin
    )

    // TODO: Figure out how to change updateAt field when chat is recreated, like there are multiple users, how can we get for every users

    // Only update for the specific user who is recreating this chat
    chat.deletedBy = deletedParticipants
    await chat.save()

    //@ts-ignore
    const chatDetails = await getCreatingChatDetails(chat?._id)
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { chat: chatDetails },
          "Updated existing chat successfully"
        )
      )
  }

  // Adding users to deletedBy array to make sure that any user won't receive
  // chat without any message, if user send message then the user will update
  // this and will send message
  // @ts-ignore
  const deletedBy = users.filter((user) => user.toString() !== admin)

  // Create a new chat if no existing chat is found
  chat = await Chat.create({
    admin,
    users,
    deletedBy,
    lastMessage: null,
  })

  //@ts-ignore
  const chatDetails = await getCreatingChatDetails(chat._id)

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { chat: chatDetails },
        "Created new chat successfully"
      )
    )
})

const getCreatingChatDetails = async (chatId: string) => {
  const chatPipeline = [
    {
      $match: { _id: chatId },
    },
    {
      $lookup: {
        from: "users",
        localField: "users",
        foreignField: "_id",
        as: "users",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "admin",
        foreignField: "_id",
        as: "admin",
      },
    },
    {
      $addFields: {
        admin: {
          $arrayElemAt: ["$admin", 0],
        },
      },
    },
    {
      $project: {
        admin: 1,
        users: 1,
        lastMessage: 1,
        updatedAt: 1,
      },
    },
  ]

  const chatDetails = await Chat.aggregate(chatPipeline)
  return chatDetails
}

/**
 * @desc    Mark a chat as deleted for a specific user by adding their userId to deletedBy.
 *          This allows soft deletion, where the chat is only hidden from the user.
 * @route   POST /api/v1/chat/delete
 * @access  Private
 *
 * @param {Request} req - Express request object containing chatId and userId
 * @param {Response} res - Express response object
 */
const deleteChat = asyncHandler(async (req: Request, res: Response) => {
  const { chatId, userId } = await req.body

  const deletedChat = await Chat.findById(chatId)

  if (!deletedChat) {
    return res.status(404).json(new ApiResponse(404, {}, "Chat not found"))
  }

  if (deletedChat?.deletedBy) {
    deletedChat.deletedBy = [...deletedChat.deletedBy, userId]
  } else {
    deletedChat.deletedBy = [userId]
  }

  const deleteMessagesOptions = [
    {
      updateMany: {
        filter: {
          chatId: deletedChat._id,
        },
        update: {
          $push: {
            deletedBy: userId,
          },
        },
      },
    },
  ]

  await Message.bulkWrite(deleteMessagesOptions)

  await deletedChat.save()

  return res.status(201).json(new ApiResponse(201, {}, "Success"))
})

/**
 * @desc    Get all the chats.
 * @route   POST /api/v1/chat/get
 * @access  Private
 *
 * @param {Request} req - Express request object containing chats details (userId)
 * @param {Response} res - Express response object contains all the chats and messages of a user
 */
const getChatsAndMessages = asyncHandler(
  async (req: Request, res: Response) => {
    const { userId } = await req.body

    // Without converting match won't match these b/c these are stored as mongoose object id
    const objectId: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(
      userId
    )
    const chatsPipeline = [
      {
        $match: {
          users: objectId,
          deletedBy: { $ne: objectId },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "users",
          foreignField: "_id",
          as: "users",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "admin",
          foreignField: "_id",
          as: "admin",
        },
      },
      {
        $lookup: {
          from: "messages",
          localField: "lastMessage",
          foreignField: "_id",
          as: "lastMessage",
        },
      },
      {
        $sort: {
          updatedAt: -1,
        },
      },
      {
        $addFields: {
          admin: {
            $arrayElemAt: ["$admin", 0],
          },
          lastMessage: {
            $arrayElemAt: ["$lastMessage", 0],
          },
        },
      },
      {
        $project: {
          _id: 1,
          admin: 1,
          users: 1,
          "lastMessage.message": 1,
          "lastMessage.photoUrl": 1,
          updatedAt: 1,
        },
      },
    ]

    // TODO Check for error
    //@ts-ignore
    let chats = await Chat.aggregate(chatsPipeline)
    /**
     * Getting all the messages of the chats, which user hasn't deleted
     * Store them inside the chats
     */
    for (let i = 0; i < chats?.length; i++) {
      const chatMessages = await getMessages(chats[i]._id.toString(), userId)
      chats[i].messages = [...chatMessages]
    }

    return res.status(200).json(new ApiResponse(200, chats, "Success"))
  }
)

const getMessages = async (chatid: string, userid: string) => {
  // Without converting match won't match these b/c these are stored as mongoose object id
  const userId: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(userid)
  const chatId: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(chatid)

  const pipeline = [
    {
      $match: {
        chatId: chatId,
        deletedBy: { $ne: userId },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "sender",
        foreignField: "_id",
        as: "sender",
      },
    },
    {
      $addFields: {
        sender: {
          $arrayElemAt: ["$sender", 0],
        },
      },
    },
    {
      $sort: {
        createdAt: 1,
      },
    },
    {
      $limit: 50,
    },
    {
      $project: {
        "sender._id": 1,
        "sender.email": 1,
        "sender.imageUrl": 1,
        "sender.lastSeen": 1,
        chatId: 1,
        message: 1,
        photoUrl: 1,
        status: 1,
        updatedAt: 1,
      },
    },
  ]

  // TODO Check for error
  //@ts-ignore
  const messages = await Message.aggregate(pipeline)
  return messages
}

const getAndUpdateChat = asyncHandler(async (req: Request, res: Response) => {
  const { chatId } = await req.body

  const existedChat = await Chat.findById(chatId)
  if (!existedChat) {
    return res.status(200).json(new ApiResponse(202, {}, "Chat not found"))
  }

  existedChat.deletedBy = []
  existedChat.save()

  const chat = await getCreatingChatDetails(chatId)
  return res.status(200).json(new ApiResponse(200, { chat }, "Sucessful"))
})

export { createChat, deleteChat, getChatsAndMessages, getAndUpdateChat }
