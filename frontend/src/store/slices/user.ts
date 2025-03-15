import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"

import { User } from "@/types/user-interface"

const initialState: User = {
  userId: null,
  fullName: "",
  email: "",
  imageUrl: "",
  isLoading: true,
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.userId = action.payload.userId
      state.email = action.payload.email
      state.fullName = action.payload.fullName
      state.imageUrl = action.payload.imageUrl
      state.isLoading = false
    },
  },
})

export const { setUser } = userSlice.actions
export default userSlice.reducer
