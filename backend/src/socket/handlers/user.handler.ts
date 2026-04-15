import { Socket } from "socket.io"

import {
  USER_CONNECTED,
  USER_ONLINE,
  USER_OFFLINE,
  USER_ONLINE_STATUS,
} from "shared"

import { ActiveUsersStore } from "../stores/active-users.store.js"
import { OnlineUsersStore } from "../stores/online-users.store.js"
import logger from "../../shared/utils/logger.js"
import type { UserRepository } from "../../modules/user/user.repository.js"

interface UserHandlerDeps {
  activeUsers: ActiveUsersStore
  onlineUsers: OnlineUsersStore
  userRepository: UserRepository
}

export function registerUserHandlers(
  socket: Socket,
  deps: UserHandlerDeps
): void {
  const { activeUsers, onlineUsers, userRepository } = deps

  socket.on(USER_CONNECTED, (userId: string) => {
    activeUsers.add({ userId, socketId: socket.id, activeChat: null })
    socket.data.userId = userId
    logger.info(`User ${userId} connected — socket ${socket.id}`)
  })

  socket.on(USER_ONLINE, (userId: string) => {
    onlineUsers.add(userId)
    userRepository
      .updateLastSeen(userId, new Date())
      .catch((err: Error) => logger.error("updateLastSeen error (online)", err))
  })

  socket.on(USER_OFFLINE, (userId: string) => {
    onlineUsers.remove(userId)
    userRepository
      .updateLastSeen(userId, new Date())
      .catch((err: Error) =>
        logger.error("updateLastSeen error (offline)", err)
      )
  })

  socket.on(USER_ONLINE_STATUS, async (userId: string, callback: Function) => {
    const isOnline = onlineUsers.isOnline(userId)
    const db_user = await userRepository.findById(userId)
    const updatedAt = isOnline
      ? null
      : db_user && db_user?.updatedAt
        ? db_user.updatedAt
        : null
    callback(isOnline, updatedAt)
  })
}
