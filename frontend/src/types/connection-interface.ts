type TShowType = "contacts" | "public" | "private"

export interface IConnection {
  _id: string
  email: string
  username: string
  imageUrl: string
  about: string
  showAbout: TShowType
  showLastSeen: TShowType
  isReadReceipts: boolean
  showProfileImage: TShowType
}
