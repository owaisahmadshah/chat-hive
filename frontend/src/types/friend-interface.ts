import { ChatUser } from "shared"

export interface friendInterface {
  _id: string
  friend: ChatUser
}

export interface FriendState {
  friends: friendInterface[]
  isLoaded: boolean
}
