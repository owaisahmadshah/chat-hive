import { createSlice, PayloadAction } from "@reduxjs/toolkit"

import { friendInterface, FriendState } from "@/types/friend-interface"

const initialState: FriendState = {
  friends: [],
  isLoaded: false,
}

const friendSlice = createSlice({
  name: "friend",
  initialState,
  reducers: {
    setFriends: (state, action: PayloadAction<friendInterface[]>) => {
      state.friends = action.payload.sort(function (a, b) {
        return a.friend.username
          .toLowerCase()
          .localeCompare(b.friend.username.toLowerCase())
      })
      state.isLoaded = true
    },
    addFriend: (state, action: PayloadAction<friendInterface>) => {
      const friends = [...state.friends, action.payload].sort(function (a, b) {
        return a.friend.username
          .toLowerCase()
          .localeCompare(b.friend.username.toLowerCase())
      })
      state.friends = friends
    },
    deleteFriend: (state, action: PayloadAction<string>) => {
      state.friends = state.friends.filter(
        (friendDocument) => friendDocument._id !== action.payload
      )
    },
    clearFriends: (state) => {
      state.friends = []
    },
  },
})

export const { setFriends, addFriend, deleteFriend, clearFriends } =
  friendSlice.actions
export default friendSlice.reducer
