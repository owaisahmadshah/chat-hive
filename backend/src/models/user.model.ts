import mongoose, { Document } from "mongoose"

type TShowType = "contacts" | "public" | "private"
interface userDocument extends Document {
  clerkId: string
  email: string
  username: string
  imageUrl: string
  isSignedIn: boolean
  about: string
  showAbout: TShowType
  showLastSeen: TShowType
  showProfileImage: TShowType
  isReadReceipts: boolean
  createdAt: Date
  updatedAt: Date
}

const userSchema = new mongoose.Schema<userDocument>(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    isSignedIn: {
      type: Boolean,
      default: false,
    },
    about: {
      type: String,
      default: "Hey there!",
    },
    showAbout: {
      type: String,
      enum: ["contacts", "public", "private"],
      default: "public",
    },
    showLastSeen: {
      type: String,
      enum: ["contacts", "public", "private"],
      default: "public",
    },
    showProfileImage: {
      type: String,
      enum: ["contacts", "public", "private"],
      default: "public",
    },
    isReadReceipts: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
)
export const User = mongoose.model("User", userSchema)
