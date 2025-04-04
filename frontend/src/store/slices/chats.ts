import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"

import { ChatsState, Chat, ChatUser } from "@/types/chat-interface"

const initialState: ChatsState = {
  chats: [],
  selectedChat: null,
  selectedChatUser: null,
  isLoading: true,
  error: null,
}

const chatsSlice = createSlice({
  name: "chats",
  initialState,
  reducers: {
    setChats: (state, action: PayloadAction<Chat[]>) => {
      state.chats = action.payload
      state.isLoading = false
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
      const chatIndex = state.chats.findIndex((chat) => chat._id === chatId)

      if (chatIndex !== -1) {
        // state.chats[chatIndex] = { ...state.chats[chatIndex], ...updates }
        const updatedChat = { ...state.chats[chatIndex], ...updates }

        // Remove the chat from its current position and place it at the front
        state.chats = [
          updatedChat,
          ...state.chats.slice(0, chatIndex),
          ...state.chats.slice(chatIndex + 1),
        ]
      }
    },
    updateChatWithPersistentOrder: (
      state,
      action: PayloadAction<{ chatId: string; updates: Partial<Chat> }>
    ) => {
      const { chatId, updates } = action.payload
      const chatIndex = state.chats.findIndex((chat) => chat._id === chatId)

      if (chatIndex !== -1) {
        state.chats[chatIndex] = { ...state.chats[chatIndex], ...updates }
      }
    },
    deleteChat: (state, action: PayloadAction<string>) => {
      state.chats = state.chats.filter((chat) => chat._id !== action.payload)
    },
    setSelectedChat: (state, action: PayloadAction<Chat | null>) => {
      state.selectedChat = action.payload
    },
    setSelectedChatUser: (state, action: PayloadAction<ChatUser | null>) => {
      state.selectedChatUser = action.payload
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
  updateChatWithPersistentOrder,
  deleteChat,
  setSelectedChat,
  setSelectedChatUser,
  setLoading,
  setError,
} = chatsSlice.actions
export default chatsSlice.reducer
