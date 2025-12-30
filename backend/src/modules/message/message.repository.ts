import mongoose from "mongoose"

import { Message } from "./message.model.js"

export class MessageRepository {
  createMessage(data: {
    sender: string
    chatId: string
    photoUrl: string
    message: string
    status: "sent" | "receive" | "seen"
  }) {
    return Message.create(data)
  }

  findByIdAndDeleteMessage({
    messageId,
    userId,
  }: {
    messageId: string
    userId: string
  }) {
    return Message.findByIdAndUpdate(
      messageId,
      {
        $addToSet: { deletedBy: new mongoose.Types.ObjectId(userId) },
      },
      { new: true }
    )
  }

  updateMessagesStatus({
    userId,
    status,
    chatId,
  }: {
    userId: string
    chatId: string
    status: string
  }) {
    return Message.updateMany(
      {
        chatId: new mongoose.Types.ObjectId(chatId),
        sender: { $ne: new mongoose.Types.ObjectId(userId) },
        status: { $in: ["sent", "receive"] },
        deletedBy: { $ne: new mongoose.Types.ObjectId(userId) },
      },
      {
        $set: { status: status },
      }
    )
  }

  findByIdAndUpdateMessageStatus({
    messageId,
    status,
  }: {
    messageId: string
    status: string
  }) {
    return Message.findByIdAndUpdate(
      messageId,
      { $set: { status } },
      { new: true }
    )
  }
}
