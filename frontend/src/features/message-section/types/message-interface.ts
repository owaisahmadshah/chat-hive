import { ChatUser } from "@/types/chat-interface"

export interface Message {
  _id: string
  sender: ChatUser
  chatId: string
  message: string
  photoUrl: string
  status: "sent" | "receive" | "seen"
  updatedAt: Date
}

// Maps chatId to an array of messages
export interface MessagesState {
  [chatId: string]: Message[]
}
