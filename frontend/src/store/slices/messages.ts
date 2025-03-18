import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { MessagesState, Message } from "@/features/message-section/types/message-interface"

const initialState: MessagesState = {}

const messagesSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    setMessages: (
      state,
      action: PayloadAction<{ chatId: string; messages: Message[] }>
    ) => {
      const { chatId, messages } = action.payload
      state[chatId] = messages
    },
    addMessage: (
      state,
      action: PayloadAction<{ chatId: string; message: Message }>
    ) => {
      const { chatId, message } = action.payload

      // Initialize the array if it doesn't exist
      if (!state[chatId]) {
        state[chatId] = []
      }

      state[chatId].push(message)
    },
    updateMessage: (
      state,
      action: PayloadAction<{
        chatId: string
        messageId: string
        updates: Partial<Message>
      }>
    ) => {
      const { chatId, messageId, updates } = action.payload

      if (state[chatId]) {
        const messageIndex = state[chatId].findIndex(
          (msg) => msg._id === messageId
        )

        if (messageIndex !== -1) {
          state[chatId][messageIndex] = {
            ...state[chatId][messageIndex],
            ...updates,
          }
        }
      }
    },
    deleteMessage: (
      state,
      action: PayloadAction<{ chatId: string; messageId: string }>
    ) => {
      const { chatId, messageId } = action.payload

      if (state[chatId]) {
        state[chatId] = state[chatId].filter(
          (message) => message._id !== messageId
        )
      }
    },
    clearChatMessages: (state, action: PayloadAction<string>) => {
      const chatId = action.payload
      if (state[chatId]) {
        state[chatId] = []
      }
    },
  },
})

export const {
  setMessages,
  addMessage,
  updateMessage,
  deleteMessage,
  clearChatMessages,
} = messagesSlice.actions
export default messagesSlice.reducer
