import mongoose, { Schema, Document } from "mongoose"

interface connectionDocument extends Document {
  sender: Schema.Types.ObjectId
  receiver: Schema.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const connectionSchema = new Schema<connectionDocument>(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
)

export const Connection = mongoose.model<connectionDocument>(
  "Connection",
  connectionSchema
)
