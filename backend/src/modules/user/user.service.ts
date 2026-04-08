import crypto from "crypto"

import { ApiError } from "../../shared/utils/ApiError.js"
import type { uploadOnCloudinary } from "../../shared/utils/Cloudinary.js"
import { generateExpiryTime, generateOTP } from "../../shared/utils/otp.js"
import type sendEmail from "../../shared/utils/sendEmail.js"
import type { ChatRepository } from "../chat/chat.repository.js"
import type { UserRepository } from "./user.repository.js"

interface IUserServiceDeps {
  userRepository: UserRepository
  chatRepository: ChatRepository
  generateOTP: typeof generateOTP
  generateExpiryTime: typeof generateExpiryTime
  sendEmail: typeof sendEmail
  jwt: typeof import("jsonwebtoken")
  uploadOnCloudinary: typeof uploadOnCloudinary
  crypto: typeof crypto
}

export class UserService {
  constructor(private deps: IUserServiceDeps) {}

  async createUser({
    email,
    username,
    password,
  }: {
    username: string
    email: string
    password: string
  }) {
    const { userRepository, generateOTP, generateExpiryTime, sendEmail } =
      this.deps

    const existingUser = await userRepository.findByEmailOrUser(email, username)

    if (existingUser) {
      throw new ApiError(409, "User with this email or username already exists")
    }

    const otpCode = generateOTP()
    const otpExpiry = generateExpiryTime()

    const isOtpSent = await sendEmail(email, otpCode)

    if (!isOtpSent) {
      throw new ApiError(500, "Internal server error.")
    }

    const user = await userRepository.create({
      email,
      username,
      password,
      otp: otpCode,
      otpExpiry,
    })

    // TODO: Remove password, opt, etc. from the response
    return user
  }

  async handleGoogleCallback({
    googleId,
    email,
    imageUrl,
  }: {
    googleId: string
    email: string
    imageUrl: string
  }) {
    const { userRepository } = this.deps

    // Already signed up via Google before
    let user = await userRepository.findByGoogleId(googleId)

    if (!user) {
      // Signed up locally with the same email — link accounts
      user = await userRepository.findByEmailOrUser(email, email)

      if (user) {
        await userRepository.linkGoogleAccount(user._id as string, googleId)
      } else {
        const username = await this.generateUniqueUsername(
          email.split("@")[0] ?? "user"
        )

        // Brand new user
        user = await userRepository.createGoogleUser({
          googleId,
          username,
          email,
          imageUrl,
        })
      }
    }

    if (!user) {
      throw new ApiError(500, "Failed to authenticate with Google")
    }

    const { accessToken, refreshToken } =
      await this.generateAccessAndRefreshToken(user._id as string)

    return { accessToken, refreshToken }
  }

  async generateUniqueUsername(name: string): Promise<string> {
    const { crypto } = this.deps

    const base = name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "_")
      .replace(/[^a-z0-9_]/g, "")
      .slice(0, 20)

    const { isUnique } = await this.uniqueUserName({ username: base })

    if (isUnique) return base

    const suffix = crypto.randomBytes(3).toString("hex")

    return `${base}_${suffix}`
  }

  async generateAccessAndRefreshToken(
    userId: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { userRepository } = this.deps

    const user = await userRepository.findById(userId)

    if (!user) {
      throw new ApiError(404, "User not found.")
    }

    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()

    await userRepository.updateRefreshToken(userId, refreshToken)

    return { accessToken, refreshToken }
  }

  async verifyOtpAndSetNewPassword({
    identifier,
    otpCode,
    password,
  }: {
    identifier: string
    otpCode: string
    password: string
  }) {
    const { userRepository } = this.deps
    const dbUser = await userRepository.findByEmailOrUser(
      identifier,
      identifier
    )

    if (!dbUser) {
      throw new ApiError(404, "User not found")
    }

    const { otp, otpExpiry } = dbUser

    if (new Date() > otpExpiry) {
      throw new ApiError(410, "OTP Expired")
    }

    if (otp !== otpCode) {
      throw new ApiError(400, "Incorrect otp code.")
    }

    if (!dbUser.isVerified) {
      await userRepository.updateIsVerified(dbUser._id as string, true)
    }

    if (password) {
      dbUser.password = password
      await userRepository.save(dbUser)
    }
  }

  async signIn({
    identifier,
    password,
  }: {
    identifier: string
    password: string
  }) {
    const { userRepository, generateOTP, generateExpiryTime, sendEmail } =
      this.deps

    const dbUser = await userRepository.findByEmailOrUser(
      identifier,
      identifier
    )

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

    const { accessToken, refreshToken } =
      await this.generateAccessAndRefreshToken(dbUser._id as string)

    dbUser.refreshToken = refreshToken

    await userRepository.save(dbUser)

    return {
      accessToken,
      refreshToken,
    }
  }

  async resendOtp({ identifier }: { identifier: string }) {
    const { userRepository, generateOTP, generateExpiryTime, sendEmail } =
      this.deps

    const user = await userRepository.findByEmailOrUser(identifier, identifier)

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

    await userRepository.saveWithoutValidation(user)
  }

  async generateRefreshAccessToken({ token }: { token: string }) {
    const { userRepository, jwt } = this.deps

    const decodedToken = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!)

    const user = await userRepository.findById((decodedToken as any)._id)

    if (!user) {
      throw new ApiError(401, "Invalid refresh token")
    }

    if (token !== user.refreshToken) {
      throw new ApiError(401, "Invalid refresh token")
    }

    const { accessToken, refreshToken } =
      await this.generateAccessAndRefreshToken(user._id as string)

    return { accessToken, refreshToken }
  }

  async changePassword({
    userId,
    oldPassword,
    newPassword,
  }: {
    userId: string
    oldPassword: string
    newPassword: string
  }) {
    const { userRepository } = this.deps

    const user = await userRepository.findById(userId)

    if (!user) {
      throw new ApiError(404, "User not found")
    }

    if (!user.isPasswordCorrect(oldPassword)) {
      throw new ApiError(400, "Original password isn't correct")
    }

    user.password = newPassword

    await user.save()
  }

  async deleteUser({ userId }: { userId: string }) {
    const { userRepository, chatRepository } = this.deps
    await userRepository.findOneAndDelete(userId)

    await chatRepository.deleteManyChats(userId)

    await chatRepository.deleteManyMessages(userId)
  }

  async getUser(userId: string) {
    const { userRepository } = this.deps

    const user = await userRepository.findByIdAndSelect(userId)

    if (!user) {
      return new ApiError(404, "User not found")
    }

    return user
  }

  async userSuggestion({ username }: { username: string }) {
    const { userRepository } = this.deps

    const user = await userRepository.findByUsername(username)

    return user
  }

  async uniqueUserName({ username }: { username: string }) {
    const { userRepository } = this.deps

    const user = await userRepository.findByUsername(username)

    return { user, isUnique: user.length ? false : true }
  }

  async uploadProfileImage(userId: string, profileImage: any) {
    const { uploadOnCloudinary, userRepository } = this.deps

    const uploadImageUrl = await uploadOnCloudinary(profileImage)

    if (!uploadImageUrl) {
      throw new ApiError(500, "Internal server error, unable to update image")
    }

    const user = await userRepository.findByIdAndUpdateImageUrl(
      userId,
      uploadImageUrl.url
    )

    if (!user) {
      throw new ApiError(404, "User not found")
    }

    return user
  }

  async updateUserShowStatus({
    userId,
    field,
    fieldValue,
  }: {
    userId: string
    field: string
    fieldValue: any
  }) {
    const { userRepository } = this.deps

    const user = await userRepository.findById(userId)

    if (!user) {
      throw new ApiError(404, "User not found")
    }

    ;(user as any)[field] = fieldValue

    await userRepository.save(user)

    const updatedUser = await userRepository.findByIdAndSelect(userId).lean()

    if (!updatedUser) {
      throw new ApiError(404, "User not found")
    }

    const userObject = updatedUser.toObject()

    const { _id, __v, password, ...responseUser } = {
      ...userObject,
      userId: userObject._id,
    }

    return responseUser
  }

  async recommendedUsers({
    userId,
    limit,
    cursor,
  }: {
    userId: string
    limit: number
    cursor: string | null
  }) {
    const { userRepository } = this.deps

    const users = await userRepository.recommendedUsers({
      userId,
      limit,
      cursor,
    })

    const hasMore = users.length === limit
    const lastUser = users.at(-1)
    const nextCursor = lastUser?.createdAt
      ? lastUser.createdAt.toISOString()
      : null

    return { users, hasMore, nextCursor }
  }

  async fetchChatUser({
    userId,
    chatUserId,
  }: {
    userId: string
    chatUserId: string
  }) {
    const [user] = await this.deps.userRepository.fetchChatUserById({
      userId,
      chatUserId,
    })

    if (!user) {
      throw new ApiError(404, "Chat user not found")
    }

    return user
  }

  signOut = async (userId: string) => {
    const { userRepository } = this.deps

    const user = await userRepository.clearRefreshToken(userId)

    if (!user) {
      throw new ApiError(404, "User not found")
    }

    return user
  }
}
