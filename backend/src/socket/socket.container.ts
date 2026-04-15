// src/socket/socket.container.ts
import { ActiveUsersStore } from "./stores/active-users.store.js"
import { SocketService } from "./services/socket.service.js"

// No io here yet — just the shared store and service shell
const activeUsers = new ActiveUsersStore()
const socketService = new SocketService(activeUsers)  // io injected later

export { activeUsers, socketService }