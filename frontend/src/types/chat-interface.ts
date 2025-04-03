export interface ChatUser {
  _id: string
  email: string
  imageUrl: string
  updatedAt: Date
  isUserOnline?: boolean
}

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
}

export interface ChatsState {
  chats: Chat[]
  selectedChat: Chat | null
  selectedChatUser: ChatUser | null
  isLoading: boolean
  error: string | null
}
