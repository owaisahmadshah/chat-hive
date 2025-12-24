import mongoose, { Schema, Document } from "mongoose"

interface friendDocument extends Document {
  user: Schema.Types.ObjectId
  friend: Schema.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const friendSchema = new Schema<friendDocument>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    friend: {
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

export const Friend = mongoose.model<friendDocument>("Friend", friendSchema)
