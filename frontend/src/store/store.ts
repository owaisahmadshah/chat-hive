import { configureStore } from "@reduxjs/toolkit"

import chatsReducer from "@/store/slices/chats"
import messagesReducer from "@/store/slices/messages"
import userReducer from "@/store/slices/user"

export const store = configureStore({
  reducer: {
    chats: chatsReducer,
    messages: messagesReducer,
    user: userReducer,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
