import { ChatRepository } from "./chat.repository.js"
import { ChatService } from "./chat.service.js"
import { ChatContoller } from "./chat.controller.js"

const chatRepository = new ChatRepository()

const chatService = new ChatService({ chatRepository })

const chatController = new ChatContoller({ chatService })

export { chatRepository, chatService, chatController }
