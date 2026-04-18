import { ChatRepository } from "./chat.repository.js"
import { ChatService } from "./chat.service.js"
import { ChatContoller } from "./chat.controller.js"
import { socketService } from "../../socket/socket.container.js"

const chatRepository = new ChatRepository()

const chatService = new ChatService({ chatRepository, socketService })

const chatController = new ChatContoller({ chatService })

export { chatRepository, chatService, chatController }
