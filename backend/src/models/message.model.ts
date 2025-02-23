import mongoose, { Schema, Document } from "mongoose"

interface messageInterface extends Document {
  sender: Schema.Types.ObjectId
  deletedBy: Schema.Types.ObjectId[]
  chatId: Schema.Types.ObjectId
  message: string
  photoUrl: string
  status: string
  createdAt: Date
  updatedAt: Date
}

const messageSchema = new Schema<messageInterface>(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    deletedBy: {
      type: [Schema.Types.ObjectId],
      ref: "User",
    },
    chatId: {
      type: Schema.Types.ObjectId,
      ref: "Chat",
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

export const Message = mongoose.model<messageInterface>(
  "Message",
  messageSchema
)
