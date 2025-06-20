import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"

import { User } from "@/types/user-interface"

const initialState: User = {
  userId: "",
  email: "",
  username: "",
  imageUrl: "",
  about: "",
  isShowAbout: "private",
  isShowLastSeen: "private",
  isReadReceipts: "private",
  isShowProfileImage: "private",
  isLoading: true,
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (_state, action: PayloadAction<User>) => {
      /*state.userId = action.payload.userId
      state.email = action.payload.email
      state.username = action.payload.username
      state.imageUrl = action.payload.imageUrl
      state.isLoading = action.payload.isLoading
      state.about = action.payload.about
      state.isShowAbout = action.payload.isShowAbout
      state.isShowLastSeen = action.payload.isShowLastSeen
      state.isReadReceipts = action.payload.isReadReceipts
      state.isShowProfileImage = action.payload.isShowProfileImage*/
      // Just returning action.payload works
      return action.payload
    },
    clearUser: (state) => {
      state.userId = ""
      state.email = ""
      state.username = ""
      state.imageUrl = ""
      state.about = ""
      state.isShowAbout = "private"
      state.isShowLastSeen = "private"
      state.isReadReceipts = "private"
      state.isShowProfileImage = "private"
      state.isLoading = false
    },
  },
})

export const { setUser, clearUser } = userSlice.actions
export default userSlice.reducer
