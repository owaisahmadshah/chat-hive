import mongoose, { Schema, Document } from "mongoose"

interface chatDocument extends Document {
  admin: Schema.Types.ObjectId
  users: Schema.Types.ObjectId[]
  deletedBy: Schema.Types.ObjectId[]
  lastMessage: Schema.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const chatSchema = new Schema<chatDocument>(
  {
    admin: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    users: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    lastMessage: {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },
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
