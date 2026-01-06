import type { Request, Response } from "express"
import type { ChatService } from "./chat.service.js"
import { asyncHandler } from "../../shared/utils/AsyncHandler.js"
import { ApiResponse } from "../../shared/utils/ApiResponse.js"
import { ApiError } from "../../shared/utils/ApiError.js"

interface IChatContollerDeps {
  chatService: ChatService
}
export class ChatContoller {
  constructor(private deps: IChatContollerDeps) {}

  /**
   * @desc    Create a new chat if it doesn't exist or return the existing chat.
   *          If the chat exists but has a different admin, update the admin.
   * @route   POST /api/v1/chat/create
   * @access  Private
   *
   * @param {Request} req - Express request object containing chat details (admin, users)
   * @param {Response} res - Express response object to return chat details
   */
  createChat = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized")
    }

    const { chatService } = this.deps
    const { users } = await req.body

    const chat = await chatService.createChat(users, req.user?._id)

    return res
      .status(200)
      .json(new ApiResponse(200, { chat }, "Created chat successfully"))
  })

  /**
   * @desc    Mark a chat as deleted for a specific user by adding their userId to deletedBy.
   *          This allows soft deletion, where the chat is only hidden from the user.
   * @route   POST /api/v1/chat/delete
   * @access  Private
   *
   * @param {Request} req - Express request object containing user and chatId
   * @param {Response} res - Express response object
   */
  deleteChat = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized")
    }

    const { chatService } = this.deps

    const userId = req.user._id
    const { chatId } = req.body

    await chatService.deleteChat({ userId, chatId })

    return res.status(201).json(new ApiResponse(201, {}, "Success"))
  })

  /**
   * @desc    Get all the chats.
   * @route   POST /api/v1/chat/chats
   * @access  Private
   *
   * @param {Request} req - Express request object containing user
   * @param {Response} res - Express response object contains all the chats
   */
  getUserChats = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized")
    }

    const { chatService } = this.deps
    const { limit, cursor } = req.query

    const userId = req.user._id

    const response = await chatService.getUserChats({
      userId,
      limit: Number(limit),
      cursor: cursor ? String(cursor) : null,
    })

    return res.status(200).json(new ApiResponse(200, response, "Success"))
  })

  getAndUpdateChat = asyncHandler(async (req: Request, res: Response) => {
    const { chatService } = this.deps
    const { chatId } = await req.body

    const chat = await chatService.getAndUpdateChat({ chatId })

    return res.status(200).json(new ApiResponse(200, { chat }, "Sucessful"))
  })

  getMoreMessages = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized")
    }

    const { chatService } = this.deps

    const userId = req.user._id
    const { chatId, userChatMessages } = await req.body

    const { messages } = await chatService.getMoreMessages({
      chatId,
      userId,
      userChatMessages,
    })

    return res.status(200).json(new ApiResponse(200, messages, "Succeess"))
  })
}
