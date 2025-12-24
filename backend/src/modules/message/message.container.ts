import { MessageRepository } from "./message.repository.js"
import { MessageService } from "./message.service.js"
import { MessageController } from "./message.controller.js"
import { chatRepository } from "../chat/chat.container.js"
import { userService } from "../user/user.container.js"

import { uploadOnCloudinary } from "../../shared/utils/Cloudinary.js"

const messageRepository = new MessageRepository()

const messageService = new MessageService({
  messageRepository,
  chatRepository,
  uploadOnCloudinary,
  userService,
})

const messageController = new MessageController({
  messageService,
})

export { messageRepository, messageService, messageController }
