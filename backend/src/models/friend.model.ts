import mongoose, { Schema, Document } from "mongoose"

interface friendDocument extends Document {
  user: Schema.Types.ObjectId
  friend: Schema.Types.ObjectId
}

const friendSchema = new Schema<friendDocument>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    friend: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

export const Friend = mongoose.model<friendDocument>("Friend", friendSchema)
