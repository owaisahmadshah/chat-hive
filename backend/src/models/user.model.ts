import mongoose, { Document, Schema, } from "mongoose"

interface userInterface extends Document {
  clerkId: string
  lastSeen: Date
  createdAt: Date
  updatedAt: Date
}

const userSchema = new Schema<userInterface>(
  {
    clerkId: {
      type: String,
      required: true,
    },
    lastSeen: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    timestamps: true,
  }
)

export const User = mongoose.model("User", userSchema)
