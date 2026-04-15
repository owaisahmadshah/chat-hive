import { Server, Socket } from "socket.io"

// import { socketAuthMiddleware } from "./middlewares/socket-auth.middleware.js"
import { ActiveUsersStore } from "./stores/active-users.store.js"
import { ChatRoomsStore } from "./stores/chat-rooms.store.js"
import { OnlineUsersStore } from "./stores/online-users.store.js"
import { registerUserHandlers } from "./handlers/user.handler.js"
import { registerChatHandlers } from "./handlers/chat.handler.js"
import { registerMessageHandlers } from "./handlers/message.handler.js"
import { registerDisconnectHandler } from "./handlers/disconnect.handler.js"
import type { UserRepository } from "../modules/user/user.repository.js"
import logger from "../shared/utils/logger.js"

interface Services {
  userRepository: UserRepository
}

export class SocketManager {
  private io: Server
  private services: Services
  private activeUsers: ActiveUsersStore
  private chatRooms = new ChatRoomsStore()
  private onlineUsers = new OnlineUsersStore()

  constructor(io: Server, services: Services, activeUsers: ActiveUsersStore) {
    this.io = io
    this.services = services
    this.activeUsers = activeUsers
    this.initialize()
  }

  private initialize(): void {
    // this.io.use(socketAuthMiddleware)

    this.io.on("connection", (socket: Socket) => {
      logger.info(`New connection: ${socket.id}`)

      registerUserHandlers(socket, {
        activeUsers: this.activeUsers,
        onlineUsers: this.onlineUsers,
        userRepository: this.services.userRepository,
      })

      registerChatHandlers(socket, {
        activeUsers: this.activeUsers,
        chatRooms: this.chatRooms,
      })

      registerMessageHandlers(socket)

      registerDisconnectHandler(socket, {
        activeUsers: this.activeUsers,
        chatRooms: this.chatRooms,
      })
    })
  }
}
