import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"

import { User } from "@/types/user-interface"

const initialState: User = {
  userId: "",
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
      state.imageUrl = action.payload.imageUrl
      state.isLoading = action.payload.isLoading
    },
  },
})

export const { setUser } = userSlice.actions
export default userSlice.reducer
