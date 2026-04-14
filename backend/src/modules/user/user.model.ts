import type { TCreateUser } from "shared"
import mongoose, { Document } from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

interface IUser
  extends Document, Omit<TCreateUser, "authProvider" | "googleId"> {
  isPasswordCorrect(password: string): Promise<boolean>
  generateAccessToken(): string
  generateRefreshToken(): string
  createdAt?: Date
  updatedAt?: Date
  googleId?: string | null
  authProvider: "local" | "google"
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
    googleId: {
      type: String,
      default: null,
      unique: true,
      sparse: true,
      index: true,
    },
    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
    isSignedIn: {
      type: Boolean,
      default: false,
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
      default: null,
    },
  },
  {
    timestamps: true,
  }
)

userSchema.pre("save", async function (this: IUser, next) {
  if (
    !this.isModified("password") ||
    !this.password ||
    this.authProvider !== "local"
  ) {
    return next()
  }

  this.password = await bcrypt.hash(this.password, 10)
  next()
})

userSchema.methods.isPasswordCorrect = async function (
  this: IUser,
  password: string
) {
  if (!this.password) {
    return false
  }
  return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
    },
    process.env.ACCESS_TOKEN_SECRET!,
    { expiresIn: "10m" }
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
