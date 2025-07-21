import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"

import { User } from "@/types/user-interface"

const initialState: User = {
  userId: "",
  email: "",
  username: "",
  imageUrl: "",
  about: "",
  showAbout: "private",
  showLastSeen: "private",
  isReadReceipts: true,
  showProfileImage: "private",
  isLoading: true,
  isSignedIn: false,
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (_state, action: PayloadAction<User>) => {
      return action.payload
    },
    clearUser: () => {
      return { ...initialState, isLoading: false }
    },
  },
})

export const { setUser, clearUser } = userSlice.actions
export default userSlice.reducer
