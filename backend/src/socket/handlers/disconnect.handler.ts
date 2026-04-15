import { Socket } from "socket.io"
import { USER_DISCONNECTED } from "shared"

import { ActiveUsersStore } from "../stores/active-users.store.js"
import { ChatRoomsStore } from "../stores/chat-rooms.store.js"
import logger from "../../shared/utils/logger.js"

interface DisconnectHandlerDeps {
  activeUsers: ActiveUsersStore
  chatRooms: ChatRoomsStore
}

export function registerDisconnectHandler(
  socket: Socket,
  deps: DisconnectHandlerDeps
): void {
  const { activeUsers, chatRooms } = deps

  socket.on("disconnect", () => {
    const userId: string = socket.data.userId
    if (!userId) return

    activeUsers.remove(userId)
    chatRooms.removeUserFromAll(userId)

    socket.broadcast.emit(USER_DISCONNECTED, userId)
    logger.info(`User ${userId} disconnected`)
  })
}
