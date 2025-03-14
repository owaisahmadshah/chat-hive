import type { Request, Response } from "express"
import { Webhook } from "svix"

import { asyncHandler } from "../utils/AsyncHandler.js"
import logger from "../utils/logger.js"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { ApiResponse } from "../utils/ApiResponse.js"

/**
 * @desc    Create a new user from clerk webhook
 * @route   POST /api/v1/webhook/signup
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
  logger.info("webhook correctly hit")

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

  // TODO remove any
  let clerkUser: any

  try {
    // Verify the webhook signature using Svix
    clerkUser = svixInstance.verify(JSON.stringify(payload), {
      "svix-id": svix_id as string,
      "svix-timestamp": svix_timestamp as string,
      "svix-signature": svix_signature as string,
    })
  } catch (error) {
    // logger.error(error?.message)
    logger.error(error)
    throw new ApiError(500, "Internel Server Error")
  }

  // Extract user data from the verified webhook payload
  const userData = {
    clerkId: clerkUser.data.id,
    fullName:
      `${clerkUser.data?.first_name} ${clerkUser.data?.last_name}`.trim(),
    email: clerkUser.data.email_addresses[0].email_address,
    imageUrl: clerkUser.data.image_url,
  }

  console.log(userData)

  const user = await User.create(userData)
  await user.save()

  return res
    .status(200)
    .json(new ApiResponse(201, { user }, "Successfully createdUser"))
})

const deleteUser = asyncHandler(async (req: Request, res: Response) => {
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

  // TODO fix any
  let clerkUser: any

  try {
    // Verify the webhook signature using Svix
    clerkUser = svixInstance.verify(JSON.stringify(payload), {
      "svix-id": svix_id as string,
      "svix-timestamp": svix_timestamp as string,
      "svix-signature": svix_signature as string,
    })
  } catch (error) {
    // logger.error(error?.message)
    logger.error(error)
    throw new ApiError(500, "Internel Server Error")
  }

  try {
    await User.findOneAndDelete({
      clerkId: clerkUser?.data?.id,
    })

    // TODO Delete all the chats, and messages of user
  } catch (error: any) {
    logger.error("Error while deleting user", error)
    throw new ApiError(500, "Something went wrong", error)
  }
})

export { createUser, deleteUser }
