import type { Request, Response } from "express"
import crypto from "crypto"

import type { UserService } from "./user.service.js"
import { ApiError } from "../../shared/utils/ApiError.js"
import { asyncHandler } from "../../shared/utils/AsyncHandler.js"
import { ApiResponse } from "../../shared/utils/ApiResponse.js"

interface IUserControllerDeps {
  userService: UserService
}

export class UserController {
  constructor(private deps: IUserControllerDeps) {}

  /**
   * @desc    Create a new user
   * @route   POST /api/v1/user/signup
   * @access  Public
   *
   * @param {Request} req - Express request object containing user details(email, username, password)
   */
  createUser = asyncHandler(async (req: Request, res: Response) => {
    const { email, username, password } = req.body

    if (!email || !username || !password) {
      throw new ApiError(400, "Email, username, and password are required")
    }

    await this.deps.userService.createUser({ email, username, password })

    return res
      .status(201)
      .json(new ApiResponse(201, {}, "Created account successfully."))
  })

  /**
   * @desc    Verifies users accounts and also set new password if provided with otp
   * @route   POST /api/v1/user/verify-otp
   * @access  Public
   *
   * @param {Request} req - Express request object containing username(email, username), otpCode and password(optional)
   * @param {Response} res - Express response message valid otp confirmation
   */
  verifyOtpAndSetNewPassword = asyncHandler(
    async (req: Request, res: Response) => {
      const { identifier, otpCode, password } = req.body

      if (!identifier || !otpCode) {
        throw new ApiError(400, "username and otp are required")
      }

      // verifyOtpAndSetNewPassword
      await this.deps.userService.verifyOtpAndSetNewPassword({
        identifier,
        otpCode,
        password,
      })

      return res.status(204).json(new ApiResponse(204, {}, "OTP verified."))
    }
  )

  /**
   * @desc    Sign in users if they are verified else will send a new verification code
   * @route   POST /api/v1/user/sign-in
   * @access  Public
   *
   * @param {Request} req - Express request object containing username(email, username), and password
   * @param {Response} res - Express response set access and refresh tokens
   */
  signIn = asyncHandler(async (req: Request, res: Response) => {
    const { identifier, password } = req.body

    const { accessToken, refreshToken } = await this.deps.userService.signIn({
      identifier,
      password,
    })

    const accessTokenOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "PRODUCTION",
      sameSite: (process.env.NODE_ENV === "PRODUCTION" ? "none" : "lax") as
        | "none"
        | "lax",
      maxAge: 50 * 60 * 1000, // 50 minutes
    }

    const refreshTokenOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "PRODUCTION",
      sameSite: (process.env.NODE_ENV === "PRODUCTION" ? "none" : "lax") as
        | "none"
        | "lax",
      maxAge: 25 * 24 * 60 * 60 * 1000, // 25 days
    }

    return res
      .status(200)
      .cookie("accessToken", accessToken, accessTokenOptions)
      .cookie("refreshToken", refreshToken, refreshTokenOptions)
      .json(new ApiResponse(200, {}, "Signed In successfully."))
  })

  /**
   * @desc    Resends otp.
   * @route   POST /api/v1/user/resend-otp
   * @access  Public
   *
   * @param {Request} req - Express request object containing username(email, username)
   * @param {Response} res - Express response message sent otp confirmation
   */
  resendOtp = asyncHandler(async (req: Request, res: Response) => {
    const { identifier } = req.body

    await this.deps.userService.resendOtp({ identifier })

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
  generateRefreshAccessToken = asyncHandler(
    async (req: Request, res: Response) => {
      const token =
        req.cookies.refreshToken ||
        req.headers["authorization"]?.replace(/^Bearer\s+/i, "").trim()

      if (!token) {
        throw new ApiError(401, "Refresh token is required.")
      }

      const { accessToken, refreshToken } =
        await this.deps.userService.generateRefreshAccessToken({ token })

      const accessTokenOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "PRODUCTION",
        sameSite: (process.env.NODE_ENV === "PRODUCTION" ? "none" : "lax") as
          | "none"
          | "lax",
        maxAge: 50 * 60 * 1000, // 50 minutes
      }

      const refreshTokenOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "PRODUCTION",
        sameSite: (process.env.NODE_ENV === "PRODUCTION" ? "none" : "lax") as
          | "none"
          | "lax",
        maxAge: 25 * 24 * 60 * 60 * 1000, // 25 days
      }

      return res
        .status(200)
        .cookie("accessToken", accessToken, accessTokenOptions)
        .cookie("refreshToken", refreshToken, refreshTokenOptions)
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
  changePassword = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(401, "Authenticated user not found in request")
    }

    const { oldPassword, newPassword } = req.body

    await this.deps.userService.changePassword({
      userId: req.user._id,
      oldPassword,
      newPassword,
    })

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
  deleteUser = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(401, "Authenticated user not found in request")
    }

    await this.deps.userService.deleteUser({ userId: req.user._id })

    const accessTokenOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "PRODUCTION",
      sameSite: (process.env.NODE_ENV === "PRODUCTION" ? "none" : "lax") as
        | "none"
        | "lax",
    }

    const refreshTokenOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "PRODUCTION",
      sameSite: (process.env.NODE_ENV === "PRODUCTION" ? "none" : "lax") as
        | "none"
        | "lax",
    }

    return res
      .status(200)
      .clearCookie("accessToken", accessTokenOptions)
      .clearCookie("refreshToken", refreshTokenOptions)
      .json(new ApiResponse(200, {}, "Deleted user successfully"))
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
  getUser = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized")
    }

    const user = await this.deps.userService.getUser(req.user._id)

    return res.status(200).json(new ApiResponse(200, user, "Success"))
  })

  /**
   * @desc    Get users data from the database that matches the username(can be anything, but now username)
   * @route   POST /api/v1/user/suggestions
   * @access  Private
   *
   * @param {Request} req - Express request object containing user email(some alphabets)
   *
   * @param {Response} res - Express request object containing user details
   *                  (_id, username, imageUrl, lastSeen)
   */
  usersSuggestion = asyncHandler(async (req: Request, res: Response) => {
    const { username } = req.query

    const users = await this.deps.userService.userSuggestion({
      username: String(username),
    })

    return res.status(200).json(new ApiResponse(200, users, "Success"))
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
  updateUserShowStatus = asyncHandler(async (req: Request, res: Response) => {
    const { userId, field, fieldValue } = req.body

    const responseUser = await this.deps.userService.updateUserShowStatus({
      userId,
      field,
      fieldValue,
    })

    return res.status(201).json(new ApiResponse(201, responseUser, "Success"))
  })

  /**
   * @desc    Create a new message.
   * @route   POST /api/v1/message/create
   * @access  Private
   *
   * @param {Request} req - Express request object containing chat details (sender, message, imnage)
   * @param {Response} res - Express response object to return message details
   */
  uploadProfileImage = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(404, "User not found.")
    }

    // @ts-ignore
    const profileImage = req.files?.profileImage?.[0]?.path

    if (profileImage) {
      throw new ApiError(401, "Profile picture not found")
    }

    const user = await this.deps.userService.uploadProfileImage(
      req.user._id,
      profileImage
    )

    return res
      .status(201)
      .json(new ApiResponse(201, user, "Updated profile image"))
  })

  /**
   * @desc    Get user by username.
   * @route   POST /api/v1/user/unique-username
   * @access  Public
   *
   * @param {Request} req - Express request object containing username
   * @param {Response} res - Express response object to return message details
   */
  uniqueUsername = asyncHandler(async (req: Request, res: Response) => {
    const { username } = req.query

    if (!username) {
      throw new ApiError(400, "Username is missing")
    }

    const response = await this.deps.userService.uniqueUserName({
      username: username as string,
    })

    return res.status(200).json(new ApiResponse(200, response, "Got users"))
  })

  recommendedUsers = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized")
    }

    const { limit, cursor } = req.query
    const userId = req.user._id

    const response = await this.deps.userService.recommendedUsers({
      userId,
      limit: Number(limit),
      cursor: cursor ? String(cursor) : null,
    })

    return res
      .status(200)
      .json(
        new ApiResponse(200, response, "Fetched recommended users successfully")
      )
  })

  fetchChatUser = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized")
    }

    const { userId: chatUserId } = req.query
    const userId = req.user._id

    const response = await this.deps.userService.fetchChatUser({
      userId,
      chatUserId: chatUserId ? String(chatUserId) : "",
    })

    return res
      .status(200)
      .json(new ApiResponse(200, response, "Fetched user successfully"))
  })

  /**
   * @desc    Sign out user by clearing access and refresh tokens.
   * @route   POST /api/v1/user/sign-out
   * @access  Private
   *
   * @param {Request} req - Express request object containing userId
   * @param {Response} res - Express response
   */
  signOut = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized")
    }

    await this.deps.userService.signOut(req.user._id)

    const accessTokenOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "PRODUCTION",
      sameSite: (process.env.NODE_ENV === "PRODUCTION" ? "none" : "lax") as
        | "none"
        | "lax",
    }

    const refreshTokenOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "PRODUCTION",
      sameSite: (process.env.NODE_ENV === "PRODUCTION" ? "none" : "lax") as
        | "none"
        | "lax",
    }

    return res
      .status(200)
      .clearCookie("accessToken", accessTokenOptions)
      .clearCookie("refreshToken", refreshTokenOptions)
      .json(new ApiResponse(200, {}, "Signed out successfully"))
  })

  /**
   * @desc    Redirects user to Google OAuth consent screen.
   * @route   GET /api/v1/user/google
   * @access  Public
   *
   * @param {Request} req - Express request object
   * @param {Response} res - Express response that redirects to Google OAuth consent screen
   */
  googleSignIn = asyncHandler(async (req: Request, res: Response) => {
    const state = crypto.randomBytes(16).toString("hex")

    const params = new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      redirect_uri: `${process.env.BACKEND_URL}/api/v1/user/google/callback`,
      response_type: "code",
      scope: "openid email profile",
      state,
      access_type: "offline",
    })

    res
      .cookie("oauth_state", state, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "PRODUCTION",
        sameSite: process.env.NODE_ENV === "PRODUCTION" ? "none" : "lax",
        maxAge: 10 * 60 * 1000, // 10 minutes
      })
      .redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`)
  })

  /**
   * @desc    Handles the Google OAuth callback.
   * @route   GET /api/v1/user/google/callback
   * @access  Public
   *
   * @param {Request} req - Express request object
   * @param {Response} res - Express response that redirects user to frontend with access and refresh tokens set in cookies
   */
  googleSignInCallback = asyncHandler(async (req: Request, res: Response) => {
    try {
      const { code, state } = req.query

      const storedState = req.cookies.oauth_state

      if (!state || state !== storedState) {
        return res.redirect(
          `${process.env.FRONTEND_URL}/sign-in?error=invalid_state`
        )
      }

      res.clearCookie("oauth_state")

      const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          code: code as string,
          client_id: process.env.GOOGLE_CLIENT_ID!,
          client_secret: process.env.GOOGLE_CLIENT_SECRET!,
          redirect_uri: `${process.env.BACKEND_URL}/api/v1/user/google/callback`,
          grant_type: "authorization_code",
        }),
      })

      if (!tokenRes.ok) {
        return res.redirect(
          `${process.env.FRONTEND_URL}/sign-in?error=google_token_failed`
        )
      }

      const tokenResJson = await tokenRes.json()

      //@ts-ignore
      const { id_token } = tokenResJson

      if (!id_token) {
        return res.redirect(
          `${process.env.FRONTEND_URL}/sign-in?error=no_token`
        )
      }

      const payload = JSON.parse(
        Buffer.from(id_token.split(".")[1], "base64url").toString()
      )

      const { accessToken, refreshToken } =
        await this.deps.userService.handleGoogleCallback({
          googleId: payload.sub,
          email: payload.email,
          imageUrl: payload.picture,
        })

      const accessTokenOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "PRODUCTION",
        sameSite: (process.env.NODE_ENV === "PRODUCTION" ? "none" : "lax") as
          | "none"
          | "lax",
        maxAge: 50 * 60 * 1000,
      }

      const refreshTokenOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "PRODUCTION",
        sameSite: (process.env.NODE_ENV === "PRODUCTION" ? "none" : "lax") as
          | "none"
          | "lax",
        maxAge: 25 * 24 * 60 * 60 * 1000,
      }

      return res
        .status(200)
        .cookie("accessToken", accessToken, accessTokenOptions)
        .cookie("refreshToken", refreshToken, refreshTokenOptions)
        .redirect(`${process.env.FRONTEND_URL}/`)
    } catch (error) {
      return res.redirect(
        `${process.env.FRONTEND_URL}/sign-in?error=google_callback_failed`
      )
    }
  })
}
