import { Socket } from "socket.io"
import { JOIN_CHAT } from "shared"

import { ActiveUsersStore } from "../stores/active-users.store.js"
import { ChatRoomsStore } from "../stores/chat-rooms.store.js"
import logger from "../../shared/utils/logger.js"

interface ChatHandlerDeps {
  activeUsers: ActiveUsersStore
  chatRooms: ChatRoomsStore
}

export function registerChatHandlers(
  socket: Socket,
  deps: ChatHandlerDeps
): void {
  const { activeUsers, chatRooms } = deps

  socket.on(JOIN_CHAT, (chatId: string) => {
    const userId: string = socket.data.userId

    socket.join(chatId)
    activeUsers.setActiveChat(userId, chatId)
    chatRooms.add(chatId, userId)

    logger.info(`User ${userId} joined chat ${chatId}`)
  })
}
