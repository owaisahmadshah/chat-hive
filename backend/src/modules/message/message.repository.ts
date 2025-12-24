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
        $addToSet: { deletedBy: userId },
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
    return Message.bulkWrite([
      {
        updateMany: {
          filter: {
            chatId: chatId,
            sender: { $ne: userId }, // Only update messages that are not sent by the user
            status: status, // Only update messages that are sent or received
            deletedBy: { $ne: userId }, // Only update messages that are not deleted by the user
          },
          update: {
            $set: {
              status: status,
            },
          },
        },
      },
    ])
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
