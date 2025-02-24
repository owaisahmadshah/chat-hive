import type { Request, Response } from "express"

import { asyncHandler } from "../utils/AsyncHandler.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Chat } from "../models/chat.model.js"
import logger from "../logger.js"

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
  }

  // TODO: Implement functionality to delete messages for this user in the chat
  return res.status(201).json(new ApiResponse(201, {}, "Success"))
})

export { createChat, deleteChat }
