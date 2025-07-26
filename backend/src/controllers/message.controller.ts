import type { Request, Response } from "express"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/AsyncHandler.js"
import { uploadOnCloudinary } from "../utils/Cloudinary.js"
import logger from "../utils/logger.js"
import { Message } from "../models/message.model.js"
import { Chat } from "../models/chat.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"

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

  // @ts-ignore
  const uploadedImages = req.files?.uploadedImage

  // Get user details once
  const userSent = await User.findById(sender).select("-clerkId -lastSignInAt")
  if (!userSent) {
    throw new ApiError(404, "User not fouond")
  }

  const messages = []

  // If just a text message
  if (!uploadedImages || uploadedImages?.length < 1) {
    const newMessage = await Message.create({
      sender,
      chatId,
      photoUrl: "",
      message,
      status,
    })

    const filteredMessage = {
      _id: newMessage._id,
      sender: userSent,
      chatId: newMessage.chatId,
      message: newMessage.message,
      photoUrl: newMessage.photoUrl,
      status: newMessage.status,
      updatedAt: newMessage.updatedAt,
    }

    messages.push(filteredMessage)
  } else if (uploadedImages.length === 1) {
    let uploadImage
    try {
      const uploadImageUrl = await uploadOnCloudinary(uploadedImages[0].path)

      uploadImage = uploadImageUrl?.url
    } catch (error) {
      uploadImage = ""
      logger.error("Something went wrong while uploading Image")
    }

    const newMessage = await Message.create({
      sender,
      chatId,
      message,
      photoUrl: uploadImage,
      status,
    })

    const filteredMessage = {
      _id: newMessage._id,
      sender: userSent,
      chatId: newMessage.chatId,
      message: newMessage.message,
      photoUrl: newMessage.photoUrl,
      status: newMessage.status,
      updatedAt: newMessage.updatedAt,
    }

    messages.push(filteredMessage)
  } else {
    for (let i = 0; i < uploadedImages.length; i++) {
      let uploadImage
      try {
        const uploadImageUrl = await uploadOnCloudinary(uploadedImages[i].path)

        uploadImage = uploadImageUrl?.url
      } catch (error) {
        uploadImage = ""
        logger.error("Something went wrong while uploading Image")
      }

      // In this case if user send multiple images there must not be any text, just pure images
      const newMessage = await Message.create({
        sender,
        chatId,
        message: "",
        photoUrl: uploadImage,
        status,
      })

      const filteredMessage = {
        _id: newMessage._id,
        sender: userSent,
        chatId: newMessage.chatId,
        message: newMessage.message,
        photoUrl: newMessage.photoUrl,
        status: newMessage.status,
        updatedAt: newMessage.updatedAt,
      }

      messages.push(filteredMessage)
    }
  }

  await Chat.findByIdAndUpdate(chatId, {
    lastMessage: messages[messages.length - 1]?._id,
    deletedBy: [], // If other user has deleted chat and we want to rejoin him the chat, we must do this
    updatedAt: new Date(),
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
const deleteMessage = asyncHandler(async (req: Request, res: Response) => {
  // TODO Update backend to properly delete lastMessage and add the second last message as lastMessage
  // TODO get chatId and update the lastMessage based on user update
  // TODO figure out how to update lastMessage

  if (!req.user) {
    throw new ApiError(401, "Unauthorized")
  }

  const userId = req.user._id
  const { messageId } = await req.body

  // const deleteMessage = await Message.findById(messageId)
  const deleteMessage = await Message.findByIdAndUpdate(
    messageId,
    {
      $addToSet: { deletedBy: userId },
    },
    { new: true }
  )

  if (!deleteMessage) {
    return res.status(404).json(new ApiResponse(404, {}, "Message not found"))
  }

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
const updateMessagesStatus = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized")
    }

    const userId = req.user._id
    const { chatId, status } = await req.body

    let statusQuery = ["sent"]
    if (status === "seen") {
      statusQuery.push("receive")
    }

    const updateMessages = [
      {
        updateMany: {
          filter: {
            chatId: chatId,
            sender: { $ne: userId }, // Only update messages that are not sent by the user
            status: statusQuery, // Only update messages that are sent or received
            deletedBy: { $ne: userId }, // Only update messages that are not deleted by the user
          },
          update: {
            $set: {
              status: status,
            },
          },
        },
      },
    ]

    await Message.bulkWrite(updateMessages)
    return res
      .status(201)
      .json(new ApiResponse(201, {}, "Updated messages successfully"))
  }
)

const updateMessageStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const { messageId, status } = await req.body

    await Message.findByIdAndUpdate(
      messageId,
      { $set: { status } },
      { new: true }
    )

    return res
      .status(201)
      .json(new ApiResponse(201, {}, "Updated message successfully"))
  }
)
export {
  createMessage,
  deleteMessage,
  updateMessagesStatus,
  updateMessageStatus,
}
