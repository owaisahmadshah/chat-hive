type TShowType = "contacts" | "public" | "private"

export interface User {
  userId: string
  email: string
  username: string
  imageUrl: string
  isLoading: boolean
  about: string
  isShowAbout: TShowType
  isShowLastSeen: TShowType
  isReadReceipts: TShowType
  isShowProfileImage: TShowType
}
