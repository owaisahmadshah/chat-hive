export interface ChatUser {
  userId: string
  email: string
  imageUrl: string
  lastSeen: Date
}

export interface Chat {
  chatId: string
  admin: ChatUser
  users: ChatUser[]
  lastMessage?: string
  updatedAt: Date | null
}

export interface ChatsState {
  chats: Chat[]
  selectedChatId: string | null
  isLoading: boolean
  error: string | null
}