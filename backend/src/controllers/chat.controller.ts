import type { Request, Response } from "express"

import { asyncHandler } from "../utils/AsyncHandler.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Chat } from "../models/chat.model.js"
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

    // Only update for the specific user who is recreating this chat
    chat.deletedBy = deletedParticipants
    await chat.save()

    //@ts-ignore
    const chatDetails = await getCreatingChatDetails(chat?._id)

    //@ts-ignore
    chatDetails[0].lastMessage = {
      isPhoto: false,
      message: "",
    }

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
  })

  //@ts-ignore
  const chatDetails = await getCreatingChatDetails(chat._id)

  //@ts-ignore
  chatDetails[0].lastMessage = {
    isPhoto: false,
    message: "",
  }

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

const getCreatingChatDetails = async (chatId: mongoose.Types.ObjectId) => {
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

  // This action won't update chat timestamps, so other user won't get wrong timestamps
  await deletedChat.save({ timestamps: false }) // agar e user ki delete pray khur usersN pachan time change no boi

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
      const { messages, unreadMessages, numberOfMessages } = await getMessages(
        chats[i]._id.toString(),
        userId,
        0,
        true
      )

      chats[i].messages = [...messages]
      chats[i].unreadMessages = unreadMessages
      chats[i].numberOfMessages = numberOfMessages

      // Manually adding last message
      const lastMessage = {
        isPhoto: false,
        message: "",
      }

      if (messages.length) {
        lastMessage.isPhoto = messages[messages.length - 1].photoUrl !== ""
        lastMessage.message = messages[messages.length - 1].message
      }

      chats[i].lastMessage = lastMessage
    }

    return res.status(200).json(new ApiResponse(200, chats, "Success"))
  }
)

const getMessages = async (
  chatid: string,
  userid: string,
  numberOfMessagesUserHave: number,
  unreadMessagesFlag: boolean = false
) => {
  // Without converting match won't match these b/c these are stored as mongoose object id
  const userId: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(userid)
  const chatId: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(chatid)

  const defaultNumberOfMessagesUserFetch = 30

  // This will give us all the new messages
  let unreadMessages = 0
  if (unreadMessagesFlag) {
    unreadMessages = await Message.countDocuments({
      sender: { $ne: userId },
      chatId: chatId,
      status: "sent",
      deletedBy: { $ne: userId },
    })
  }

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
      $facet: {
        messages: [
          {
            $sort: {
              createdAt: -1,
            },
          },
          {
            $limit:
              numberOfMessagesUserHave +
              unreadMessages +
              defaultNumberOfMessagesUserFetch,
          },
          { $skip: numberOfMessagesUserHave }, // This will skip all the messages that user have
          {
            $sort: {
              createdAt: 1,
            },
          },
        ],
        unreadMessages: [
          {
            $match: {
              "sender._id": { $ne: userId },
              status: { $in: ["sent", "receive"] },
            },
          },
          {
            $count: "totalUnreadMessages",
          },
        ],
        sentMessages: [
          {
            $match: {
              chatId: chatId,
              "sender._id": { $ne: userId }, // sender is not our user
              deletedBy: { $ne: userId }, // our user hasn't deleted it yet
              status: "sent",
            },
          },
          {
            $count: "numberOfMessages",
          },
        ],
      },
    },
    {
      $project: {
        "messages._id": 1,
        "messages.sender._id": 1,
        "messages.sender.email": 1,
        "messages.sender.imageUrl": 1,
        "messages.chatId": 1,
        "messages.message": 1,
        "messages.photoUrl": 1,
        "messages.status": 1,
        "messages.updatedAt": 1,
        unreadMessages: 1,
        sentMessages: 1,
      },
    },
  ]

  // @ts-ignore
  const messages = await Message.aggregate(pipeline)
  // [{messages: [{}, {}, {}, ...]}, {unreadMessages: [{totalUnreadMessages}]}, { sentMessages: [{numberOfMessages}]}]
  // [{messages: [{}, {}, {}, ...]}, {unreadMessages: []}, { sentMessages: [] }] if no unread messages

  if (messages[0].unreadMessages.length === 0) {
    messages[0].unreadMessages.push({ totalUnreadMessages: 0 })
  }

  if (messages[0].sentMessages.length === 0) {
    messages[0].sentMessages.push({ numberOfMessages: 0 })
  }

  // Getting and updating all the sent messages, if we are receiver and not received the messages yet, we will mark them as read, and get their chatIds and numberOfSentMessages
  const markReceivedMessagesOprtions = [
    {
      updateMany: {
        filter: {
          chatId: chatId,
          sender: { $ne: userId },
          deletedBy: { $ne: userId },
          status: "sent",
        },
        update: {
          status: "receive",
        },
      },
    },
  ]

  await Message.bulkWrite(markReceivedMessagesOprtions)

  return {
    messages: messages[0].messages,
    unreadMessages: messages[0].unreadMessages[0].totalUnreadMessages,
    numberOfMessages: messages[0].sentMessages[0].numberOfMessages,
  }
}

const getAndUpdateChat = asyncHandler(async (req: Request, res: Response) => {
  const { chatId } = await req.body

  const existedChat = await Chat.findById(chatId)
  if (!existedChat) {
    return res.status(200).json(new ApiResponse(202, {}, "Chat not found"))
  }

  const chatObjectId: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(
    chatId
  )

  const chat = await getCreatingChatDetails(chatObjectId)
  chat[0].lastMessage = {
    isPhoto: false,
    message: "",
  }
  chat[0].unreadMessages = 0
  return res.status(200).json(new ApiResponse(200, { chat }, "Sucessful"))
})

const getMoreMessages = asyncHandler(async (req: Request, res: Response) => {
  const { chatId, userId, userChatMessages } = await req.body

  const { messages } = await getMessages(chatId, userId, userChatMessages)

  return res.status(200).json(new ApiResponse(200, messages, "Succeess"))
})

export {
  createChat,
  deleteChat,
  getChatsAndMessages,
  getAndUpdateChat,
  getMoreMessages,
}
