import type { Document } from "mongoose"
import { Chat } from "./chat.model.js"
import mongoose from "mongoose"
import { Message } from "../message/message.model.js"

export class ChatRepository {
  findChat(users: string[]) {
    return Chat.findOne({
      users: {
        $all: users,
        $size: users.length,
      },
    })
  }

  findById(chatId: string) {
    return Chat.findById(chatId)
  }

  createChat({ users, deletedBy }: { users: string[]; deletedBy: string[] }) {
    return Chat.create({
      users,
      deletedBy,
    })
  }

  findUserChats({
    userId,
    limit,
    cursor,
  }: {
    userId: string
    limit: number
    cursor: string | null
  }) {
    const userObjectId = new mongoose.Types.ObjectId(userId)

    let filter: any = {
      users: userObjectId,
      deletedBy: { $ne: userObjectId },
    }

    if (cursor) {
      filter.updatedAt = { $lt: new Date(cursor) }
    }

    return Chat.aggregate([
      {
        $match: filter,
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
        $sort: {
          updatedAt: 1,
        },
      },
      {
        $lookup: {
          from: "users",
          let: { userIds: "$users" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $in: ["$_id", "$$userIds"] },
                    { $ne: ["$_id", userObjectId] },
                  ],
                },
              },
            },
            {
              $project: {
                _id: 1,
                username: 1,
                imageUrl: 1,
              },
            },
          ],
          as: "user",
        },
      },
      {
        $lookup: {
          from: "messages",
          let: {
            chatId: "$_id",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: ["$chatId", "$$chatId"],
                    },
                    {
                      $ne: ["$deletedBy", userObjectId],
                    },
                  ],
                },
              },
            },
            {
              $sort: {
                updatedAt: -1,
              },
            },
            {
              $limit: 1,
            },
            {
              $project: {
                message: 1,
                photoUrl: 1,
                status: 1,
                chatId: 1,
                sender: 1,
              },
            },
          ],
          as: "lastMessage",
        },
      },
      {
        $lookup: {
          from: "messages",
          let: {
            chatId: "$_id",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: ["$chatId", "$$chatId"],
                    },
                    {
                      $ne: ["$deletedBy", userObjectId],
                    },
                    {
                      receiver: userObjectId,
                    },
                    {
                      $or: [
                        {
                          status: "sent",
                        },
                        {
                          status: "receive",
                        },
                      ],
                    },
                  ],
                },
              },
            },
            {
              $count: "totalUnreadMessages",
            },
          ],
          as: "unreadMessages",
        },
      },
      {
        $addFields: {
          lastMessage: {
            $ifNull: [{ $arrayElemAt: ["$lastMessage", 0] }, {}],
          },
          unreadMessages: {
            $ifNull: [
              {
                $arrayElemAt: ["$unreadMessages.totalUnreadMessages", 0],
              },
              0,
            ],
          },
          user: {
            $arrayElemAt: ["$user", 0],
          },
        },
      },
      {
        $project: {
          user: 1,
          createdAt: 1,
          updatedAt: 1,
          lastMessage: 1,
          unreadMessages: 1,
        },
      },
    ])
  }

  findCreateChatDetails(id: string) {
    const chatId = new mongoose.Types.ObjectId(id)
    return Chat.aggregate([
      {
        $match: { _id: chatId },
      },
      {
        $lookup: {
          from: "users",
          localField: "users",
          foreignField: "_id",
          as: "users",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "admin",
          foreignField: "_id",
          as: "admin",
        },
      },
      {
        $addFields: {
          admin: {
            $arrayElemAt: ["$admin", 0],
          },
        },
      },
      {
        $project: {
          admin: 1,
          users: 1,
          updatedAt: 1,
        },
      },
    ])
  }

  findByIdAndUpdateChat(chatId: string, userId: string) {
    return Chat.findByIdAndUpdate(
      chatId,
      { $addToSet: { deletedBy: userId } },
      { new: true, timestamps: false }
    )
  }

  // TODO Move it to message repo
  deleteBulkMessage(chatId: string, userId: string) {
    return Message.bulkWrite([
      {
        updateMany: {
          filter: { chatId },
          update: {
            $push: { deletedBy: userId },
          },
        },
      },
    ])
  }

  findChats(id: string) {
    const userId = new mongoose.Types.ObjectId(id)

    return Chat.aggregate([
      {
        $match: {
          users: userId,
          deletedBy: { $ne: userId },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "users",
          foreignField: "_id",
          as: "users",
        },
      },
      {
        $lookup: {
          from: "messages",
          localField: "lastMessage",
          foreignField: "_id",
          as: "lastMessage",
        },
      },
      {
        $sort: {
          updatedAt: -1,
        },
      },
      {
        $addFields: {
          admin: {
            $arrayElemAt: ["$admin", 0],
          },
          lastMessage: {
            $arrayElemAt: ["$lastMessage", 0],
          },
        },
      },
      {
        $project: {
          _id: 1,
          admin: 1,
          users: 1,
          "lastMessage.message": 1,
          "lastMessage.photoUrl": 1,
          updatedAt: 1,
        },
      },
    ])
  }

  save(doc: Document) {
    return doc.save()
  }

  // TODO Move to messages repository or just fetch them with chats aggregation
  findMessages({
    chat_id,
    user_id,
    limit,
    skip,
  }: {
    chat_id: string
    user_id: string
    limit: number
    skip: number
  }) {
    const chatId = new mongoose.Types.ObjectId(chat_id)
    const userId = new mongoose.Types.ObjectId(user_id)

    return Message.aggregate([
      {
        $match: {
          chatId: chatId,
          deletedBy: { $ne: userId },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "sender",
          foreignField: "_id",
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
        $facet: {
          messages: [
            {
              $sort: {
                createdAt: -1,
              },
            },
            {
              $limit: limit,
            },
            { $skip: skip }, // This will skip all the messages that user have
            {
              $sort: {
                createdAt: 1,
              },
            },
          ],
          unreadMessages: [
            {
              $match: {
                "sender._id": { $ne: userId },
                status: { $in: ["sent", "receive"] },
              },
            },
            {
              $count: "totalUnreadMessages",
            },
          ],
          sentMessages: [
            {
              $match: {
                chatId: chatId,
                "sender._id": { $ne: userId }, // sender is not our user
                deletedBy: { $ne: userId }, // our user hasn't deleted it yet
                status: "sent",
              },
            },
            {
              $count: "numberOfMessages",
            },
          ],
        },
      },
      {
        $project: {
          "messages._id": 1,
          "messages.sender._id": 1,
          "messages.sender.email": 1,
          "messages.sender.username": 1,
          "messages.sender.imageUrl": 1,
          "messages.sender.about": 1,
          "messages.sender.showAbout": 1,
          "messages.sender.showLastSeen": 1,
          "messages.sender.showProfileImage": 1,
          "messages.sender.isReadReceipts": 1,
          "messages.chatId": 1,
          "messages.message": 1,
          "messages.photoUrl": 1,
          "messages.status": 1,
          "messages.updatedAt": 1,
          unreadMessages: 1,
          sentMessages: 1,
        },
      },
    ])
  }

  // TODO Move to message repository
  updateBulkMessagesForReceived(chatId: string, userId: string) {
    return Message.bulkWrite([
      {
        updateMany: {
          filter: {
            chatId: chatId,
            sender: { $ne: userId },
            deletedBy: { $ne: userId },
            status: "sent",
          },
          update: {
            status: "receive",
          },
        },
      },
    ])
  }

  countUnreadMessages(userId: string, chatId: string) {
    return Message.countDocuments({
      sender: { $ne: userId },
      chatId: chatId,
      status: "sent",
      deletedBy: { $ne: userId },
    })
  }

  deleteManyChats(userId: string) {
    return Chat.deleteMany({ $or: [{ users: userId }, { deletedBy: userId }] })
  }

  // TODO Move to message repo
  deleteManyMessages(userId: string) {
    return Message.deleteMany({
      $or: [{ sender: userId }, { receiver: userId }],
    })
  }

  findByIdAndUpdateLastMessage({
    messageId,
    chatId,
  }: {
    messageId: string
    chatId: string
  }) {
    return Chat.findByIdAndUpdate(chatId, {
      lastMessage: messageId,
      deletedBy: [], // If other user has deleted chat and we want to rejoin him the chat, we must do this
      updatedAt: new Date(),
    })
  }
}
