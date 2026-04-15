import { ActiveUsersStore } from "./stores/active-users.store.js"
import { SocketService } from "./services/socket.service.js"

const activeUsers = new ActiveUsersStore()

const socketService = new SocketService(activeUsers)

export { activeUsers, socketService }
