import { ChatUser } from "shared"

export interface Chat {
  _id: string
  admin: ChatUser
  users: ChatUser[]
  updatedAt: Date
  lastMessage: {
    isPhoto: boolean
    message: string
  }
  typing?: {
    typer: string
    isTyping: boolean
  }
  unreadMessages: number
}

export interface ChatsState {
  chats: Chat[]
  selectedChat: Chat | null
  selectedChatUser: ChatUser | null
  isLoading: boolean
  error: string | null
}
