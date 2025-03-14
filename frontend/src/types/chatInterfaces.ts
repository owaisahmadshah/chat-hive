// TODO update admin and users they will contain all the users data

export interface Chat {
  chatId: string
  admin: string
  users: string[]
  lastMessage?: string
  updatedAt: Date | null
}

export interface ChatsState {
  chats: Chat[]
  selectedChatId: string | null
  isLoading: boolean
  error: string | null
}