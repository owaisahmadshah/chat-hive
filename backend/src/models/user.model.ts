import type { TCreateUser } from "shared"
import mongoose, { Document } from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

interface IUser extends Document, TCreateUser {
  isPasswordCorrect(password: string): Promise<boolean>
  generateAccessToken(): string
  generateRefreshToken(): string
}

const userSchema = new mongoose.Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    imageUrl: {
      type: String,
      required: true,
      default: "./default-profile-picture.jpg",
    },
    isSignedIn: {
      type: Boolean,
      default: false,
    },
    about: {
      type: String,
      default: "Hey there!",
    },
    showAbout: {
      type: String,
      enum: ["contacts", "public", "private"],
      default: "public",
    },
    showLastSeen: {
      type: String,
      enum: ["contacts", "public", "private"],
      default: "public",
    },
    showProfileImage: {
      type: String,
      enum: ["contacts", "public", "private"],
      default: "public",
    },
    isReadReceipts: {
      type: Boolean,
      default: true,
    },
    refreshToken: {
      type: String,
      default: null,
    },
    otp: {
      type: String,
      default: null,
    },
    otpExpiry: {
      type: Date,
      default: null,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      required: [true, "Password is required."],
    },
  },
  {
    timestamps: true,
  }
)

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next()
  }

  this.password = await bcrypt.hash(this.password, 10)
  next()
})

userSchema.methods.isPasswordCorrect = async function (password: string) {
  return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      role: this.role,
    },
    process.env.ACCESS_TOKEN_SECRET!,
    { expiresIn: "1h" }
  )
}

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET!,
    { expiresIn: "14d" }
  )
}

export const User = mongoose.model("User", userSchema)
