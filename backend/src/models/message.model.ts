import mongoose, { Schema, Document } from "mongoose"

interface messageDocument extends Document {
  sender: Schema.Types.ObjectId
  deletedBy: Schema.Types.ObjectId[]
  chatId: Schema.Types.ObjectId
  message: string
  photoUrl: string
  status: string
  createdAt: Date
  updatedAt: Date
}

const messageSchema = new Schema<messageDocument>(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    deletedBy: {
      type: [Schema.Types.ObjectId],
      ref: "User",
    },
    chatId: {
      type: Schema.Types.ObjectId,
      ref: "Chat",
      index: true,
    },
    message: {
      type: "String",
    },
    photoUrl: {
      type: "String",
      default: "",
    },
    status: {
      type: "String",
      enum: ["sent", "receive", "seen"],
      default: "sent",
    },
  },
  {
    timestamps: true,
  }
)

export const Message = mongoose.model<messageDocument>("Message", messageSchema)
