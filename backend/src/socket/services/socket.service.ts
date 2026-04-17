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

  emit_message(chatId: string, data: any, receiver: string) {
    if (!this.io) return

    const senderId = data.sender._id
    const senderSocketId = this.activeUsers.get(String(senderId))

    const message = {
      message: data,
      messageUsers: [data.sender._id, data.receiver],
    }

    if (senderSocketId) {
      this.io
        .to(chatId)
        .timeout(2000)
        .except(senderSocketId.socketId)
        .emit(
          NEW_MESSAGE,
          message,
          (error: any, res: { success: boolean; message: string }[]) => {
            if (error?.length || res.length === 0)
              this.emit_message_to_receiver(receiver, message)
          }
        )
    } else {
      this.io
        .to(chatId)
        .emit(
          NEW_MESSAGE,
          message,
          (error: any, res: { success: boolean; message: string }[]) => {
            console.log(error, res)
            if (error?.length || res.length === 0)
              this.emit_message_to_receiver(receiver, message)
          }
        )
    }
  }

  emit_message_to_receiver(receiver: string, message: any) {
    const receiverSocketId = this.activeUsers.get(String(receiver))
    if (receiverSocketId && this.io) {
      this.io.to(receiverSocketId.socketId).emit(NEW_MESSAGE, message)
    }
  }

  emit_messages(chatId: string, data: any[], receiver: string) {
    if (!this.io) return

    data.forEach((message: any) => this.emit_message(chatId, message, receiver))
  }
}
