import mongoose, { Document, Schema } from "mongoose"

interface userDocument extends Document {
  clerkId: string
  email: string
  username: string
  imageUrl: string
  isSignedIn: boolean
  createdAt: Date
  updatedAt: Date
}

const userSchema = new mongoose.Schema<userDocument>(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
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
    },
    isSignedIn: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)
export const User = mongoose.model("User", userSchema)
