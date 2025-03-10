import type { Request, Response } from "express"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/AsyncHandler.js"
import { uploadOnCloudinary } from "../utils/Cloudinary.js"
import logger from "../logger.js"
import { Message } from "../models/message.model.js"

/**
 * @desc    Create a new message.
 * @route   POST /api/v1/message/create
 * @access  Private
 *
 * @param {Request} req - Express request object containing chat details (sender, message, imnage)
 * @param {Response} res - Express response object to return message details
 */
const createMessage = asyncHandler(async (req: Request, res: Response) => {
  const { sender, chatId, message, status } = await req.body

  //TODO remove this ignore
  //@ts-ignore
  const uploadedImage = req.files?.uploadedImage?.[0]?.path
  let uploadImage

  if (uploadedImage) {
    try {
      const uploadImageUrl = await uploadOnCloudinary(uploadedImage)

      uploadImage = uploadImageUrl?.url
      logger.info("Uploaded Image")
    } catch (error) {
      uploadImage = ""
      logger.error("Something went wrong while uploading Image")
    }
  }

  const newMessage = await Message.create({
    sender,
    chatId,
    message,
    photoUrl: uploadImage,
    status,
  })

  logger.info("Created new message successfully")

  return res
    .status(201)
    .json(new ApiResponse(201, { newMessage }, "Created message"))
})

/**
 * @desc    Delete a message.
 * @route   POST /api/v1/message/delete
 * @access  Private
 *
 * @param {Request} req - Express request object containing chat details (userId, messageId)
 * @param {Response} res - Express response object contains success or failure of message deletion
 */
const deleteMessage = asyncHandler(async (req: Request, res: Response) => {
  const { messageId, userId } = await req.body

  const deleteMessage = await Message.findById(messageId)

  if (!deleteMessage) {
    return res.status(404).json(new ApiResponse(404, {}, "Message not found"))
  }

  if (deleteMessage?.deletedBy) {
    deleteMessage.deletedBy = [...deleteMessage.deletedBy, userId]
  }
  await deleteMessage.save()
  return res
    .status(201)
    .json(new ApiResponse(201, {}, "Deleted Message successfully"))
})

export { createMessage, deleteMessage }
