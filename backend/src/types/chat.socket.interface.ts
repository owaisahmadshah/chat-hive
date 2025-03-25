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
  lastMessage: {
    message: string
    photoUrl?: string
  } | null
  updatedAt: Date
}