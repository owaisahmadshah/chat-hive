import type { Request, Response } from "express"
import { Webhook } from "svix"
import { clerkClient } from "@clerk/express"

import { asyncHandler } from "../utils/AsyncHandler.js"
import logger from "../utils/logger.js"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Chat } from "../models/chat.model.js"
import { Message } from "../models/message.model.js"
import { Friend } from "../models/friend.model.js"

/**
 * @desc    Create a new user from clerk webhook
 * @route   POST /api/v1/user/signup
 * @access  Public
 *
 * @param {Request} req - Express request object containing user details
 *                  (clerkId, fullName, email, imageUrl, lastSeen, lastSignInAt,
 *                  createdAt, updatedAt)
 * @param {Response} res - Express response object containg user data
 *
 * @details This controller handles webhook events from Clerk authentication service.
 *          It verifies the webhook signature using Svix, extracts user data from the payload,
 *          and creates a new user in the database. The verification process ensures
 *          that the webhook request is legitimate and comes from Clerk.
 */
const createUser = asyncHandler(async (req: Request, res: Response) => {
  const SIGNING_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!SIGNING_SECRET) {
    logger.error(
      "Error: Please add SIGNING_SECRET from Clerk Dashboard to .env"
    )
    return new ApiError(500, "Internal Server Error")
  }

  // Create new Svix instance with secret for webhook verification
  const svixInstance = new Webhook(SIGNING_SECRET)

  // Extract headers and payload from the request
  const headers = req.headers
  const payload = req.body

  // Extract Svix verification headers
  const svix_id = headers["svix-id"]
  const svix_timestamp = headers["svix-timestamp"]
  const svix_signature = headers["svix-signature"]

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new ApiError(500, "Error: Missing svix headers")
  }

  try {
    // Verify the webhook signature using Svix
    //@ts-ignore
    const { data } = svixInstance.verify(JSON.stringify(payload), {
      "svix-id": svix_id as string,
      "svix-timestamp": svix_timestamp as string,
      "svix-signature": svix_signature as string,
    })

    // Extract user data from the verified webhook payload
    const userData = {
      clerkId: data.id,
      email: data.email_addresses[0].email_address,
      username: data.username,
      imageUrl: data.image_url,
      isSignedIn: true,
    }

    const user = await User.create(userData)
    await user.save()

    return res
      .status(200)
      .json(new ApiResponse(201, {}, "Successfully createdUser"))
  } catch (error) {
    // logger.error(error?.message)
    logger.error(error)
    throw new ApiError(500, "Internel Server Error")
  }
})

/**
 * @desc    Deletes user data, including profile, chats and messages
 * @route   POST /api/v1/user/delete
 * @access  Private
 *
 * @param {Request} req - Express request object containing userId and clerkId
 * @param {Response} res - Express response message delete confirmation
 */
const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const SIGNING_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!SIGNING_SECRET) {
    logger.error(
      "Error: Please add SIGNING_SECRET from Clerk Dashboard to .env"
    )
    return new ApiError(500, "Internal Server Error")
  }

  const { userId, clerkId } = req.body

  try {
    await clerkClient.users.deleteUser(clerkId)

    await User.findOneAndDelete({ _id: userId })
    await Chat.deleteMany({ $or: [{ users: userId }, { deletedBy: userId }] })
    await Message.deleteMany({ sender: userId })

    return res
      .status(201)
      .json(new ApiResponse(200, {}, "Deleted user successfully"))
  } catch (error: any) {
    logger.error("Error while deleting user", error)
    throw new ApiError(500, "Something went wrong", error)
  }
})

/**
 * @desc    Get user data from the database by using userId and send to the frontend
 * @route   POST /api/v1/user/get
 * @access  Private
 *
 * @param {Request} req - Express request object containing user clerkId
 *
 * @param {Response} res - Express request object containing user details
 *                  (clerkId, fullName, email, imageUrl, lastSeen, lastSignInAt,
 *                   updatedAt)
 */
const getUser = asyncHandler(async (req: Request, res: Response) => {
  const { clerkId } = await req.body

  const user = await User.findOne({ clerkId }).select(
    "_id email username imageUrl lastSignInAt about isShowAbout isShowLastSeen isReadReceipts isShowProfileImage"
  )

  if (!user) {
    return new ApiError(404, "User not found")
  }

  return res.status(200).json(new ApiResponse(200, user, "Success"))
})

/**
 * @desc    Get users data from the database that matches the identifier(can be anything, but now username)
 * @route   POST /api/v1/user/suggestions
 * @access  Private
 *
 * @param {Request} req - Express request object containing user email(some alphabets)
 *
 * @param {Response} res - Express request object containing user details
 *                  (_id, username, imageUrl, lastSeen)
 */
const usersSuggestion = asyncHandler(async (req: Request, res: Response) => {
  const { identifier } = req.body

  const users = await User.find({ username: identifier })

  return res.status(200).json(new ApiResponse(200, { users }, "Success"))
})

/**
 * @desc    Create new friend
 * @route   POST /api/v1/user/create-friend
 * @access  Private
 *
 * @param {Request} req - Express request object containing userId, friendId
 *
 * @param {Response} res - Express request object containing friend details
 *                  (_id, username, imageUrl, lastSeen)
 */
const createFriend = asyncHandler(async (req: Request, res: Response) => {
  const { userId, friendId } = req.body

  const userData = {
    user: userId,
    friend: friendId,
  }

  const existedFriend = await Friend.findOne(userData).populate(
    "friend",
    "_id username imageUrl updatedAt"
  )

  if (existedFriend) {
    return res
      .status(200)
      .json(new ApiResponse(200, { existedFriend }, "User exists"))
  }

  await Friend.create(userData)

  const friend = await Friend.findOne(userData)
    .select("_id friend")
    .populate("friend", "_id username imageUrl updatedAt")

  return res.status(201).json(new ApiResponse(200, { friend }, "Success"))
})

/**
 * @desc    Get friends
 * @route   POST /api/v1/user/get-friends
 * @access  Private
 *
 * @param {Request} req - Express request object containing userId
 *
 * @param {Response} res - Express request object containing friends list
 *                  [(_id, username, imageUrl, lastSeen)]
 */
const getFriends = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.body

  const friends = await Friend.find({ user: userId })
    .select("_id friend")
    .populate("friend", "_id username imageUrl updatedAt")

  return res.status(201).json(new ApiResponse(200, { friends }, "Success"))
})

/**
 * @desc    Detele friend
 * @route   POST /api/v1/user/delete-friend
 * @access  Private
 *
 * @param {Request} req - Express request object containing friend document id
 *
 * @param {Response} res - Express request object containing message of sucess/failure
 */
const deleteFriend = asyncHandler(async (req: Request, res: Response) => {
  const { friendDocumentId } = req.body

  await Friend.findByIdAndDelete(friendDocumentId)

  return res.status(200).json(new ApiResponse(200, {}, "Success"))
})

const updateUserShowStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const { userId, field, fieldValue } = req.body

    const user = await User.findById(userId)

    if (!user) {
      throw new ApiError(404, "User not found")
    }

    ;(user as any)[field] = fieldValue
    await user.save()

    return res.json(201).json(new ApiResponse(201, user, "Success"))
  }
)

export {
  createUser,
  deleteUser,
  getUser,
  usersSuggestion,
  createFriend,
  getFriends,
  deleteFriend,
  updateUserShowStatus,
}
