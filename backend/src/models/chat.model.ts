import mongoose, { Schema, Document } from "mongoose"

interface chatInterface extends Document {
  admin: Schema.Types.ObjectId
  users: Schema.Types.ObjectId[]
  deletedBy: Schema.Types.ObjectId[]
  createdAt: Date
  updatedAt: Date
}

const chatSchema = new Schema<chatInterface>(
  {
    admin: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
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

export const Chat = mongoose.model<chatInterface>("Chat", chatSchema)
