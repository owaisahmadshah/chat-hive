import { ApiError } from "../../shared/utils/ApiError.js"
import type { uploadOnCloudinary } from "../../shared/utils/Cloudinary.js"

import type { ChatRepository } from "../chat/chat.repository.js"
import type { UserService } from "../user/user.service.js"
import { MessageRepository } from "./message.repository.js"

interface IMessageServiceDeps {
  messageRepository: MessageRepository
  userService: UserService
  chatRepository: ChatRepository
  uploadOnCloudinary: typeof uploadOnCloudinary
}

export class MessageService {
  constructor(private deps: IMessageServiceDeps) {}

  async createMessage({
    sender,
    uploadedImages,
    chatId,
    message,
    status,
  }: {
    sender: string
    uploadedImages: File[] | null
    chatId: string
    message: string
    status: "sent" | "receive" | "seen"
  }) {
    const {
      userService,
      messageRepository,
      uploadOnCloudinary,
      chatRepository,
    } = this.deps

    const userSent = await userService.getUser(sender)

    if (!userSent) {
      throw new ApiError(404, "User not fouond")
    }

    const messages = []

    // If just a text message
    if (!uploadedImages || uploadedImages?.length < 1) {
      const newMessage = await messageRepository.createMessage({
        sender,
        chatId,
        photoUrl: "",
        message,
        status,
      })

      const filteredMessage = {
        _id: newMessage._id,
        sender: userSent,
        chatId: newMessage.chatId,
        message: newMessage.message,
        photoUrl: newMessage.photoUrl,
        status: newMessage.status,
        updatedAt: newMessage.updatedAt,
      }

      messages.push(filteredMessage)
    } else if (uploadedImages.length === 1) {
      let uploadImage
      try {
        const uploadImageUrl = await uploadOnCloudinary(
          // @ts-ignore
          uploadedImages[0].path
        )

        uploadImage = uploadImageUrl?.url
      } catch (error) {
        uploadImage = ""
      }

      const newMessage = await messageRepository.createMessage({
        sender,
        chatId,
        message,
        photoUrl: uploadImage as string,
        status,
      })

      const filteredMessage = {
        _id: newMessage._id,
        sender: userSent,
        chatId: newMessage.chatId,
        message: newMessage.message,
        photoUrl: newMessage.photoUrl,
        status: newMessage.status,
        updatedAt: newMessage.updatedAt,
      }

      messages.push(filteredMessage)
    } else {
      for (let i = 0; i < uploadedImages.length; i++) {
        let uploadImage
        try {
          const uploadImageUrl = await uploadOnCloudinary(
            // @ts-ignore
            uploadedImages[i].path
          )

          uploadImage = uploadImageUrl?.url
        } catch (error) {
          uploadImage = ""
        }

        // In this case if user send multiple images there must not be any text, just pure images
        const newMessage = await messageRepository.createMessage({
          sender,
          chatId,
          message: "",
          photoUrl: uploadImage as string,
          status,
        })

        const filteredMessage = {
          _id: newMessage._id,
          sender: userSent,
          chatId: newMessage.chatId,
          message: newMessage.message,
          photoUrl: newMessage.photoUrl,
          status: newMessage.status,
          updatedAt: newMessage.updatedAt,
        }

        messages.push(filteredMessage)
      }
    }

    await chatRepository.findByIdAndUpdateLastMessage({
      chatId,
      messageId: messages[messages.length - 1]?._id as string,
    })

    return {
      ...messages,
      sender: {
        _id: userSent._id.toString(),
        username: userSent.username,
        imageUrl: userSent.imageUrl
      },
    }
  }

  async deleteMessage({
    messageId,
    userId,
  }: {
    messageId: string
    userId: string
  }) {
    const { messageRepository } = this.deps

    const deleteMessage = await messageRepository.findByIdAndDeleteMessage({
      messageId,
      userId,
    })

    if (!deleteMessage) {
      throw new ApiError(404, "Message not found")
    }
  }

  async updateMessagesStatus({
    userId,
    chatId,
    status,
  }: {
    userId: string
    chatId: string
    status: string
  }) {
    const { messageRepository } = this.deps

    let statusQuery = ["sent"]
    if (status === "seen") {
      statusQuery.push("receive")
    }

    const messages = await messageRepository.updateMessagesStatus({
      userId,
      status,
      chatId,
    })

    return messages
  }

  async updateMessageStatus({
    messageId,
    status,
  }: {
    messageId: string
    status: string
  }) {
    const message =
      await this.deps.messageRepository.findByIdAndUpdateMessageStatus({
        messageId,
        status,
      })

    return message
  }

  async getMessagesByChatId({
    chatId,
    userId,
    limit,
    cursor,
  }: {
    chatId: string
    userId: string
    limit: number
    cursor: null | string
  }) {
    const { messageRepository } = this.deps

    const messages = await messageRepository.findMessagesByChatId({
      chatId,
      userId,
      limit,
      cursor,
    })

    const hasMore = messages.length === limit
    const lastMessage = messages.at(-1)
    const nextCursor =
      lastMessage?.updatedAt && hasMore ? lastMessage.updatedAt : null

    return {
      messages,
      hasMore,
      nextCursor,
    }
  }
}
