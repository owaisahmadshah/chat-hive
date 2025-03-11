import type { Request, Response } from "express"

import { asyncHandler } from "../utils/AsyncHandler.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Chat } from "../models/chat.model.js"
import logger from "../logger.js"
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
    },
  })

  if (chat) {
    if (chat.admin !== admin) {
      chat.admin = admin
    }

    // If a user is recreating the chat, reset the deletedBy array to allow communication
    chat.deletedBy = []

    await chat.save()

    logger.info(`Returning existing chat with ID: ${chat._id}`)
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { chatId: chat._id, users },
          "Updated existing chat successfully"
        )
      )
  }

  // Create a new chat if no existing chat is found
  chat = await Chat.create({
    admin,
    users,
    lastMessage: null,
  })

  logger.info(`New chat created with ID: ${chat._id}`)
  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { chatId: chat._id, users },
        "Created new chat successfully"
      )
    )
})

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

  await deletedChat.save()

  // TODO: Implement functionality to delete messages for this user in the chat
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

    // TODO check why here we have to convert ids and why we don't heve to change getMessages()
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
          chatUser: {
            $cond: {
              if: {
                $eq: ["$users[0]._id", objectId],
              },
              then: {
                $arrayElemAt: ["$users", 0],
              },
              else: {
                $arrayElemAt: ["$users", 1],
              },
            },
          },
        },
      },
      {
        $project: {
          _id: 1,
          admin: 1,
          chatUser: 1,
          lastMessage: 1,
          createdAt: 1,
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
      const chatMessages = await getMessages(
        chats[i]._id.toString(),
        userId.toString()
      )
      chats[i].messages = [...chatMessages]
    }

    return res
      .status(200)
      .json(new ApiResponse(200, chats, "Success"))
  }
)

const getMessages = async (chatId: string, userid: string) => {
  const userId: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(userid)

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
      $sort: {
        createdAt: -1,
      },
    },
    {
      $limit: 50,
    },
    {
      $project: {
        sender: 1,
        chatId: 1,
        message: 1,
        photoUrl: 1,
        status: 1,
        createdAt: 1,
        updatedAt: 1,
      },
    },
  ]

  // TODO Check for error
  //@ts-ignore
  const messages = await Message.aggregate(pipeline)
  return messages
}

export { createChat, deleteChat, getChatsAndMessages }
