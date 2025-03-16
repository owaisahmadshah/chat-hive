import { User } from "./user-interface"

export interface ChatUser {
  _id: string
  email: string
  imageUrl: string
  lastSeen: Date
}

export interface Chat {
  _id: string
  admin: ChatUser
  users: ChatUser[]
  lastMessage?: string
  updatedAt: Date | null
}

export interface ChatsState {
  chats: Chat[]
  selectedChat: Chat | null
  selectedChatUser: User | null
  isLoading: boolean
  error: string | null
}
