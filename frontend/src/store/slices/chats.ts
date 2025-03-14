import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"

import { ChatsState, Chat } from "@/types/chatInterfaces"

const initialState: ChatsState = {
  chats: [],
  selectedChatId: null,
  isLoading: false,
  error: null,
}

const chatsSlice = createSlice({
  name: "chats",
  initialState,
  reducers: {
    setChats:  (state, action: PayloadAction<Chat[]>) => {
      state.chats = action.payload
    },
    addChat: (state, action: PayloadAction<Chat>) => {
      // state.chats.push(action.payload)
      state.chats = [action.payload, ...state.chats]
    },
    updateChat: (
      state,
      action: PayloadAction<{ chatId: string; updates: Partial<Chat> }>
    ) => {
      const { chatId, updates } = action.payload
      const chatIndex = state.chats.findIndex((chat) => chat.chatId === chatId)

      if (chatIndex !== -1) {
        state.chats[chatIndex] = { ...state.chats[chatIndex], ...updates }
      }
    },
    deleteChat: (state, action: PayloadAction<string>) => {
      state.chats = state.chats.filter((chat) => chat.chatId !== action.payload)
    },
    setSelectedChat: (state, action: PayloadAction<string | null>) => {
      state.selectedChatId = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
  },
})

export const {
  setChats,
  addChat,
  updateChat,
  deleteChat,
  setSelectedChat,
  setLoading,
  setError,
} = chatsSlice.actions
export default chatsSlice.reducer
