import { configureStore } from "@reduxjs/toolkit"

import chatsReducer from "@/store/slices/chats"

export const store = configureStore({
  reducer: {
    chats: chatsReducer,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
