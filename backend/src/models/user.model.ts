import mongoose, { Document, Schema } from "mongoose"

interface userDocument extends Document {
  clerkId: string
  fullName: String
  email: String
  imageUrl: String
  lastSignInAt: Date
  createdAt: Date
  updatedAt: Date
}

const userSchema = new mongoose.Schema<userDocument>(
  {
    clerkId: { type: String, required: true, unique: true },
    fullName: String,
    email: {
      type: String,
      unique: true,
      index: true,
    },
    imageUrl: String,
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
