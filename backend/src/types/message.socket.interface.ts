import type { ChatUser } from "./chat.socket.interface.js"

export interface Message {
  _id: string
  sender: ChatUser
  chatId: string
  message: string
  photoUrl: string
  status: "sent" | "receive" | "seen"
  updatedAt: Date
}
