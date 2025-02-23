import mongoose, { Schema, Document } from "mongoose"

interface contactInterface extends Document {
  userId: Schema.Types.ObjectId
  email: string
  createdAt: Date
  updatedAt: Date
}

const contactSchema = new Schema<contactInterface>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  email: {
    type: String,
  },
})

export const Contact = mongoose.model<contactInterface>(
  "Contact",
  contactSchema
)
