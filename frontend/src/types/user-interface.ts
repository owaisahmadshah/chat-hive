type TShowType = "contacts" | "public" | "private"

export interface User {
  userId: string
  email: string
  username: string
  imageUrl: string
  isLoading: boolean
  about: string
  showAbout: TShowType
  showLastSeen: TShowType
  isReadReceipts: boolean
  showProfileImage: TShowType
  isSignedIn: boolean
}
