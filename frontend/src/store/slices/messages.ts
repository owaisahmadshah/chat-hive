import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import {
  MessagesState,
  Message,
} from "@/features/message-section/types/message-interface"

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
    updateMessages: (
      state,
      action: PayloadAction<{
        chatId: string
        receiver: string
        ourUserId: string
        numberOfMessages: number
        updates: Partial<Message>
      }>
    ) => {
      const { chatId, ourUserId, updates } = action.payload
      let { numberOfMessages } = action.payload

      if (state[chatId].length > 0) {
        /**
         * Some minor errors are present here it is updating the last messages that are either send or receive by our user.
         *  So we have to just update the messages which our user has send
         * */
        /*for (
          let i = state[chatId].length - numberOfMessages - 1;
          i < state[chatId].length;
          i++
        ) {
          // if message sender is our user then update the message
          if (state[chatId][i].sender._id === ourUserId) {
            state[chatId][i] = {
              ...state[chatId][i],
              ...updates,
            }
          }
        }*/
        /**This solves the problem */
        let i = state[chatId].length - 1
        while (i >= 0 && numberOfMessages > 0) {
          if (state[chatId][i].sender._id == ourUserId) {
            state[chatId][i] = {
              ...state[chatId][i],
              ...updates,
            }
            --numberOfMessages
          }
          --i
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
  updateMessages,
  deleteMessage,
  clearChatMessages,
} = messagesSlice.actions
export default messagesSlice.reducer
