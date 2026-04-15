import { createServer } from "http"
import { Server } from "socket.io"

import { app } from "../app.js"
import { userRepository } from "../modules/user/user.container.js"
import { SocketManager } from "./socket.manager.js"
import logger from "../shared/utils/logger.js"
import { ActiveUsersStore } from "./stores/active-users.store.js"
import { socketService } from "./socket.container.js"

const socketHttpServer = createServer(app)

const io = new Server(socketHttpServer, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
})

const activeUsers = new ActiveUsersStore()

socketService.setIO(io)
new SocketManager(io, { userRepository }, activeUsers)

logger.info("Socket.IO server initialized")

export { socketHttpServer }
