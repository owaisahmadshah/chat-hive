import mongoose, { Schema, Document } from "mongoose"

interface contactDocument extends Document {
  userId: Schema.Types.ObjectId
  email: string
  createdAt: Date
  updatedAt: Date
}

const contactSchema = new Schema<contactDocument>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    index: true,
  },
  email: {
    type: String,
  },
})

export const Contact = mongoose.model<contactDocument>(
  "Contact",
  contactSchema
)
