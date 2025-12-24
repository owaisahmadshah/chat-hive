import mongoose, { Schema, Document } from "mongoose"

interface chatDocument extends Document {
  users: Schema.Types.ObjectId[]
  deletedBy: Schema.Types.ObjectId[]
  createdAt: Date
  updatedAt: Date
}

const chatSchema = new Schema<chatDocument>(
  {
    users: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    deletedBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
)

export const Chat = mongoose.model<chatDocument>("Chat", chatSchema)
