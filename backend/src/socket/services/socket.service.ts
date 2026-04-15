import { Server } from "socket.io"

import { NEW_MESSAGE } from "shared"
import type { ActiveUsersStore } from "../stores/active-users.store.js"

export class SocketService {
  private io: Server | null = null
  private activeUsers: ActiveUsersStore

  constructor(activeUsers: ActiveUsersStore) {
    this.activeUsers = activeUsers
  }

  setIO(io: Server): void {
    this.io = io
  }

  emit_message(chatId: string, data: any) {
    if (!this.io) return

    const senderId = data.sender._id
    const senderSocketId = this.activeUsers.get(senderId)

    const message = {
      message: data,
      messageUsers: [data.sender._id, data.receiver],
    }

    if (senderSocketId) {
      this.io
        .to(chatId)
        .except(senderSocketId.socketId)
        .emit(NEW_MESSAGE, message)
    } else {
      this.io.to(chatId).emit(NEW_MESSAGE, message)
    }
  }

  emit_messages(chatId: string, data: any[]) {
    if (!this.io) return

    data.forEach((message: any) => this.emit_message(chatId, message))
  }
}
