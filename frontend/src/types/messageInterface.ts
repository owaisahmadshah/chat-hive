// TODO update sender it will contain all the info of the sender
export interface Message {
  messageId: string
  sender: string
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
