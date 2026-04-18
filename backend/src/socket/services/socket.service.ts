import { Server } from "socket.io"

import {
  NEW_MESSAGE,
  SEEN_AND_RECEIVE_MESSAGE,
  SEEN_AND_RECEIVE_MESSAGES,
  type handleSeenAndReceiveMessagesType,
  type handleSeenAndReceiveMessageType,
} from "shared"
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
    const senderSocketId = this.get_socket_id(String(senderId))

    const message = {
      message: data,
      messageUsers: [data.sender._id, data.receiver],
    }

    if (senderSocketId) {
      this.io
        .to(chatId)
        .timeout(2000)
        .except(senderSocketId)
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
            if (error?.length || res.length === 0)
              this.emit_message_to_receiver(receiver, message)
          }
        )
    }
  }

  emit_message_to_receiver(receiver: string, message: any) {
    console.log("Emitting to receiver id")
    const receiverSocketId = this.get_socket_id(String(receiver))
    if (receiverSocketId && this.io) {
      this.io.to(receiverSocketId).emit(NEW_MESSAGE, message)
    }
  }

  emit_messages(chatId: string, data: any[], receiver: string) {
    if (!this.io) return

    data.forEach((message: any) => this.emit_message(chatId, message, receiver))
  }

  emit_message_status(chatId: string, data: handleSeenAndReceiveMessageType) {
    if (!this.io) return

    const receiverSocketId = this.get_socket_id(String(data.receiver))

    if (receiverSocketId) {
      this.io
        .to(chatId)
        .except(receiverSocketId)
        .emit(SEEN_AND_RECEIVE_MESSAGE, data)
    } else {
      this.io.to(chatId).emit(SEEN_AND_RECEIVE_MESSAGE, data)
    }
  }

  emit_messages_status(chatId: string, data: handleSeenAndReceiveMessagesType) {
    if (!this.io) return

    const receiverSocketId = this.get_socket_id(String(data.receiver))

    if (receiverSocketId) {
      this.io
        .to(chatId)
        .except(receiverSocketId)
        .emit(SEEN_AND_RECEIVE_MESSAGES, data)
    } else {
      this.io.to(chatId).emit(SEEN_AND_RECEIVE_MESSAGES, data)
    }
  }

  emit_messages_array_status(data: handleSeenAndReceiveMessagesType[]) {
    data.forEach((chat: handleSeenAndReceiveMessagesType) =>
      this.emit_messages_status(chat.chatId, chat)
    )
  }

  get_socket_id(id: string): string | null {
    const socket_user = this.activeUsers.get(String(id))

    return socket_user ? socket_user.socketId : null
  }
}
