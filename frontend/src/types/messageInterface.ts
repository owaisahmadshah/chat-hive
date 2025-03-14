import { ChatUser } from "@/types/chatInterfaces"

export interface Message {
  messageId: string
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
