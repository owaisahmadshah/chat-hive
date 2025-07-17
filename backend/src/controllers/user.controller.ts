import type { Request, Response } from "express"

import { asyncHandler } from "../utils/AsyncHandler.js"
import logger from "../utils/logger.js"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Chat } from "../models/chat.model.js"
import { Message } from "../models/message.model.js"
import { Friend } from "../models/friend.model.js"
import { uploadOnCloudinary } from "../utils/Cloudinary.js"
import { generateExpiryTime, generateOTP } from "../utils/otp.js"
import sendEmail from "../utils/sendEmail.js"
import jwt from "jsonwebtoken"

/**
 * @desc    Create a new user
 * @route   POST /api/v1/user/signup
 * @access  Public
 *
 * @param {Request} req - Express request object containing user details(email, username, password)
 */
const createUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, username, password } = req.body

  if (!email || !username || !password) {
    throw new ApiError(400, "Email, username, and password are required")
  }

  // Check if user already exists
  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
  })

  if (existingUser) {
    throw new ApiError(409, "User with this email or username already exists")
  }

  const otpCode = generateOTP()
  const otpExpiry = generateExpiryTime()

  // Sending otp email
  const isOtpSent = await sendEmail(email, otpCode)

  if (!isOtpSent) {
    throw new ApiError(500, "Internal server error.")
  }

  await User.create({
    email,
    username,
    password,
    otp: otpCode,
    otpExpiry,
  })

  return res
    .status(201)
    .json(new ApiResponse(201, {}, "Created account successfully."))
})

const generateAccessAndRefreshToken = async (
  userId: string
): Promise<{ accessToken: string; refreshToken: string }> => {
  const user = await User.findById(userId)

  if (!user) {
    throw new ApiError(404, "User not found.")
  }

  const accessToken = user.generateAccessToken()
  const refreshToken = user.generateRefreshToken()

  await User.updateOne({ _id: user._id }, { refreshToken })

  return { accessToken, refreshToken }
}

/**
 * @desc    Verifies users accounts and also set new password if provided with otp
 * @route   POST /api/v1/user/verify-otp
 * @access  Public
 *
 * @param {Request} req - Express request object containing identifier(email, username), otpCode and password(optional)
 * @param {Response} res - Express response message valid otp confirmation
 */
const verifyOtpAndSetNewPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { identifier, otpCode, password } = req.body

    if (!identifier || !otpCode) {
      throw new ApiError(400, "Identifier and otp are required")
    }

    const dbUser = await User.findOne({
      $or: [
        {
          email: identifier,
        },
        {
          username: identifier,
        },
      ],
    })

    if (!dbUser) {
      throw new ApiError(404, "User not found")
    }

    const { otp, otpExpiry } = dbUser

    if (new Date() > otpExpiry) {
      throw new ApiError(410, "OTP")
    }

    if (otp !== otpCode) {
      throw new ApiError(401, "Incorrect otp code.")
    }

    if (!dbUser.isVerified) {
      await User.updateOne({ _id: dbUser._id }, { isVerified: true })
    }

    // If user sets new password
    if (password) {
      dbUser.password = password
      await dbUser.save()
    }

    return res.status(204).json(new ApiResponse(204, {}, "OTP verified."))
  }
)

/**
 * @desc    Sign in users if they are verified else will send a new verification code
 * @route   POST /api/v1/user/sign-in
 * @access  Public
 *
 * @param {Request} req - Express request object containing identifier(email, username), and password
 * @param {Response} res - Express response set access and refresh tokens
 */
const signIn = asyncHandler(async (req: Request, res: Response) => {
  const { identifier, password } = req.body

  const dbUser = await User.findOne({
    $or: [{ email: identifier }, { username: identifier }],
  })

  if (!dbUser) {
    throw new ApiError(404, "User with this email/username is not found.")
  }

  // If user has account but didn't verified.
  if (!dbUser.isVerified) {
    const otpCode = generateOTP()
    const otpExpiry = generateExpiryTime()

    // Sending otp email
    const isOtpSent = await sendEmail(dbUser.email, otpCode)

    if (!isOtpSent) {
      throw new ApiError(500, "Internal server error.")
    }

    dbUser.otp = otpCode
    dbUser.otpExpiry = otpExpiry
    await dbUser.save({ validateBeforeSave: false })

    throw new ApiError(
      403,
      "Account not verified. Please verify your account with the OTP sent to your email."
    )
  }

  const isPasswordCorrect = await dbUser.isPasswordCorrect(password)

  if (!isPasswordCorrect) {
    throw new ApiError(401, "Incorrect Password")
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    dbUser._id as string
  )

  dbUser.refreshToken = refreshToken

  await dbUser.save({ validateBeforeSave: false })

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  }

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(204, {}, "Signed In successfully."))
})

/**
 * @desc    Resends otp.
 * @route   POST /api/v1/user/resend-otp
 * @access  Public
 *
 * @param {Request} req - Express request object containing identifier(email, username)
 * @param {Response} res - Express response message sent otp confirmation
 */
const resendOtp = asyncHandler(async (req: Request, res: Response) => {
  const { identifier } = req.body

  const user = await User.findOne({
    $or: [{ email: identifier }, { username: identifier }],
  })

  if (!user) {
    throw new ApiError(404, "User not found")
  }

  const otp = generateOTP()
  const otpExpiry = generateExpiryTime()

  const isOtpSent = await sendEmail(
    user.email,
    otp,
    "Chat-Hive account verification code"
  )

  if (!isOtpSent) {
    throw new ApiError(500, "Internal server error.")
  }

  user.otp = otp
  user.otpExpiry = otpExpiry

  await user.save({ validateBeforeSave: false })

  return res
    .status(200)
    .json(new ApiResponse(204, {}, "Successfully sent otp."))
})

/**
 * @desc    Generates refresh access token
 * @route   POST /api/v1/user/refresh-token
 * @access  Public
 *
 * @param {Request} req - Express request object containing old token
 * @param {Response} res - Express response set new refresh and access tokens
 */
const generateRefreshAccessToken = asyncHandler(
  async (req: Request, res: Response) => {
    const token =
      req.cookies.refreshToken ||
      req.headers["authorization"]?.replace(/^Bearer\s+/i, "").trim()

    if (!token) {
      throw new ApiError(401, "Refresh token is required.")
    }

    const decodedToken = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!)

    const user = await User.findById((decodedToken as any)._id)

    if (!user) {
      throw new ApiError(401, "Invalid refresh token")
    }

    if (token !== user.refreshToken) {
      throw new ApiError(401, "Invalid refresh token")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user._id as string
    )

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    }

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(new ApiResponse(205, {}, ""))
  }
)

/**
 * @desc    Sets new password
 * @route   POST /api/v1/user/change-password
 * @access  Private
 *
 * @param {Request} req - Express request object containing old and new password
 * @param {Response} res - Express response
 */
const changePassword = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, "Authenticated user not found in request")
  }

  const { oldPassword, newPassword } = req.body

  const user = await User.findById(req.user._id as string)

  if (!user) {
    throw new ApiError(404, "User not found")
  }

  if (!user.isPasswordCorrect(oldPassword)) {
    throw new ApiError(400, "Original password isn't correct")
  }

  user.password = newPassword

  await user.save()

  return res
    .status(200)
    .json(new ApiResponse(204, {}, "Successfully changed password"))
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
  if (!req.user) {
    throw new ApiError(401, "Authenticated user not found in request")
  }

  const { _id } = req.user

  try {
    await User.findOneAndDelete({ _id: _id })
    await Chat.deleteMany({ $or: [{ users: _id }, { deletedBy: _id }] })
    await Message.deleteMany({ sender: _id })

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    }

    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
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
    "_id email username imageUrl lastSignInAt about isReadReceipts showAbout showLastSeen showProfileImage"
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

/**
 * @desc    Update user profile
 * @route   POST /api/v1/user/update-user-fields
 * @access  Private
 *
 * @param {Request} req - Express request object containing user id, field(name of the field) and fieldValue(value of field)
 *
 * @param {Response} res - Express request object containing message of sucess/failure and update user object
 */
const updateUserShowStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const { userId, field, fieldValue } = req.body

    const user = await User.findById(userId)

    if (!user) {
      throw new ApiError(404, "User not found")
    }

    ;(user as any)[field] = fieldValue
    await user.save()

    const updatedUser = await User.findById(userId)
      .select(
        "_id email username imageUrl lastSignInAt about isReadReceipts showAbout showLastSeen showProfileImage"
      )
      .lean()

    if (!updatedUser) {
      throw new ApiError(404, "User not found")
    }

    const responseUser = {
      ...updatedUser,
      userId: updatedUser._id,
    }

    // @ts-ignore
    delete responseUser._id

    return res.status(201).json(new ApiResponse(201, responseUser, "Success"))
  }
)

/**
 * @desc    Create a new message.
 * @route   POST /api/v1/message/create
 * @access  Private
 *
 * @param {Request} req - Express request object containing chat details (sender, message, imnage)
 * @param {Response} res - Express response object to return message details
 */
const uploadProfileImage = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = await req.body

  // @ts-ignore
  const profileImage = req.files?.profileImage?.[0]?.path

  if (profileImage) {
    throw new ApiError(401, "Profile picture not found")
  }

  const uploadImageUrl = await uploadOnCloudinary(profileImage)

  const imageUrl = uploadImageUrl?.url
  logger.info("Uploaded Profile Image")

  const user = await User.findByIdAndUpdate(userId, { imageUrl }, { new: true })

  return res
    .status(201)
    .json(new ApiResponse(201, user, "Updated profile image"))
})

export {
  createUser,
  generateAccessAndRefreshToken,
  verifyOtpAndSetNewPassword,
  signIn,
  resendOtp,
  generateRefreshAccessToken,
  changePassword,
  deleteUser,
  getUser,
  usersSuggestion,
  createFriend,
  getFriends,
  deleteFriend,
  updateUserShowStatus,
  uploadProfileImage,
}
