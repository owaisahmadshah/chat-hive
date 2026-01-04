import { Connection } from "./connection.model.js"

export class ConnectionRepository {
  findById(id: string) {
    return Connection.findById(id)
      .select("sender receiver createdAt updatedAt")
      .populate({
        path: "sender",
        select: "_id username imageUrl lastSeen",
      })
      .populate({
        path: "receiver",
        select: "_id username imageUrl lastSeen",
      })
      .lean()
  }

  createConnection({
    senderId,
    receiverId,
  }: {
    senderId: string
    receiverId: string
  }) {
    return Connection.create({ sender: senderId, receiver: receiverId })
  }

  deleteConnectionById({ connectionId }: { connectionId: string }) {
    return Connection.findByIdAndDelete(connectionId)
  }

  findConnectionBySenderAndReceiver({
    senderId: senderId,
    receiverId: receiverId,
  }: {
    senderId: string
    receiverId: string
  }) {
    return Connection.findOne({
      sender: senderId,
      receiver: receiverId,
    })
  }

  findAllConnectionsBySenderId({ senderId }: { senderId: string }) {
    return Connection.find({ sender: senderId })
      .select("sender receiver createdAt updatedAt")
      .populate({
        path: "sender",
        select: "_id username imageUrl lastSeen",
      })
      .populate({
        path: "receiver",
        select: "_id username imageUrl lastSeen",
      })
      .lean()
  }
}
