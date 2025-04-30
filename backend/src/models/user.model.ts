import mongoose, { Document, Schema } from "mongoose"

interface userDocument extends Document {
  clerkId: string
  email: String
  username: String
  imageUrl: String
  isSignedIn: boolean
  lastSignInAt: Date
  createdAt: Date
  updatedAt: Date
}

const userSchema = new mongoose.Schema<userDocument>(
  {
    clerkId: { type: String, required: true, unique: true },
    email: {
      type: String,
      unique: true,
      index: true,
    },
    username: {
      type: String,
      unique: true,
      index: true,
    },
    imageUrl: String,
    isSignedIn: {
      type: Boolean,
      default: false,
    },
    lastSignInAt: {
      type: Date,
      Default: Date.now(),
    },
  },
  {
    timestamps: true,
  }
)
export const User = mongoose.model("User", userSchema)
