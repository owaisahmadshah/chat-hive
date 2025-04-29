import { Message } from "shared"

// Maps chatId to an array of messages
export interface MessagesState {
  [chatId: string]: Message[]
}
