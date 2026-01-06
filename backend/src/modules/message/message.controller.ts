import type { Request, Response } from "express"

import type { MessageService } from "./message.service.js"
import { asyncHandler } from "../../shared/utils/AsyncHandler.js"
import { ApiResponse } from "../../shared/utils/ApiResponse.js"
import { ApiError } from "../../shared/utils/ApiError.js"

interface IMessageControllerDeps {
  messageService: MessageService
}

export class MessageController {
  constructor(private deps: IMessageControllerDeps) {}

  /**
   * @desc    Create a new message.
   * @route   POST /api/v1/message/create
   * @access  Private
   *
   * @param {Request} req - Express request object containing chat details (sender, message, imnage)
   * @param {Response} res - Express response object to return message details
   */
  createMessage = asyncHandler(async (req: Request, res: Response) => {
    const { messageService } = this.deps
    const { sender, chatId, message, status } = await req.body

    const messages = await messageService.createMessage({
      sender: sender as string,
      chatId: chatId as string,
      message: message as string,
      status: status as "sent" | "receive" | "seen",
      // @ts-ignore
      uploadedImages: req.file?.uploadedImage,
    })

    return res
      .status(201)
      .json(new ApiResponse(201, { messages }, "Created messages"))
  })

  /**
   * @desc    Delete a message.
   * @route   POST /api/v1/message/delete
   * @access  Private
   *
   * @param {Request} req - Express request object containing chat details (userId, messageId)
   * @param {Response} res - Express response object contains success or failure of message deletion
   */
  deleteMessage = asyncHandler(async (req: Request, res: Response) => {
    // TODO Update backend to properly delete lastMessage and add the second last message as lastMessage
    // TODO get chatId and update the lastMessage based on user update
    // TODO figure out how to update lastMessage

    if (!req.user) {
      throw new ApiError(401, "Unauthorized")
    }

    const { messageId } = await req.body

    await this.deps.messageService.deleteMessage({
      userId: req.user._id as string,
      messageId: messageId as string,
    })

    return res
      .status(201)
      .json(new ApiResponse(201, {}, "Deleted Message successfully"))
  })

  /**
   * @desc    Update a message status.
   * @route   POST /api/v1/message/updatestatus
   * @access  Private
   *
   * @param {Request} req - Express request object containing message details (userId, chatId, status)
   * @param {Response} res - Express response object contains success or failure of message deletion
   */
  updateMessagesStatus = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized")
    }

    const userId = req.user._id
    const { chatId, status } = await req.body

    await this.deps.messageService.updateMessagesStatus({
      userId,
      chatId,
      status,
    })

    return res
      .status(201)
      .json(new ApiResponse(201, {}, "Updated messages successfully"))
  })

  updateMessageStatus = asyncHandler(async (req: Request, res: Response) => {
    const { messageId, status } = await req.body

    await this.deps.messageService.updateMessageStatus({
      messageId,
      status,
    })

    return res
      .status(201)
      .json(new ApiResponse(201, {}, "Updated message successfully"))
  })

  /**
   * @desc    Fetch messages by chatId.
   * @route   POST /api/v1/message/messages
   * @access  Private
   *
   * @param {Request} req - Express request object containing message details (chatId)
   * @param {Response} res - Express response object contains messages, hasMore, and nextCursor
   */
  getMessages = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized")
    }

    const userId = req.user._id
    const { cursor, limit, chatId } = req.query

    const response = this.deps.messageService.getMessagesByChatId({
      chatId: String(chatId),
      userId,
      limit: Number(limit),
      cursor: cursor ? String(cursor) : null,
    })

    return res
      .status(201)
      .json(new ApiResponse(201, response, "Successfully fetched messsages"))
  })
}
