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

  findMessagesByChatId({
    chatId,
    userId,
    limit,
    cursor,
  }: {
    chatId: string
    userId: string
    limit: number
    cursor: null | string
  }) {
    const chatObjId = new mongoose.Types.ObjectId(chatId)
    const userObjId = new mongoose.Types.ObjectId(userId)

    const filter: any = {
      chatId: chatObjId,
      deletedBy: {
        $ne: userObjId,
      },
    }

    if (cursor) {
      filter.updatedAt = {
        $lt: new Date(cursor),
      }
    }

    return Message.aggregate([
      {
        $match: filter
      },
      {
        $sort: {
          updatedAt: -1,
        },
      },
      {
        $limit: limit,
      },
      {
        $lookup: {
          from: "users",
          let: {
            userId: "$sender",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", "$$userId"],
                },
              },
            },
            {
              $project: {
                username: 1,
                imageUrl: 1,
              },
            },
          ],
          as: "sender",
        },
      },
      {
        $addFields: {
          sender: {
            $arrayElemAt: ["$sender", 0],
          },
        },
      },
      {
        $project: {
          deletedBy: 0,
        },
      },
    ])
  }
}
