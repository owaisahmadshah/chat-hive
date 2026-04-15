import { Socket } from "socket.io"
import {
  TYPING,
  SEEN_AND_RECEIVE_MESSAGE,
  SEEN_AND_RECEIVE_MESSAGES,
  type typingType,
  type handleSeenAndReceiveMessageType,
  type handleSeenAndReceiveMessagesType,
} from "shared"


export function registerMessageHandlers(
  socket: Socket,
): void {
  socket.on(
    SEEN_AND_RECEIVE_MESSAGE,
    (data: handleSeenAndReceiveMessageType) => {
      socket.to(data.chatId).emit(SEEN_AND_RECEIVE_MESSAGE, data)
    }
  )

  socket.on(
    SEEN_AND_RECEIVE_MESSAGES,
    (data: handleSeenAndReceiveMessagesType) => {
      socket.to(data.chatId).emit(SEEN_AND_RECEIVE_MESSAGES, data)
    }
  )

  socket.on(TYPING, (data: typingType) => {
    socket.to(data.chatId).emit(TYPING, data)
  })
}
