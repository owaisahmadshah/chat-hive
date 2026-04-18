import type { newMessageType, TDeletedMessageResponse } from "shared"
import { ApiError } from "../../shared/utils/ApiError.js"
import type { uploadOnCloudinary } from "../../shared/utils/Cloudinary.js"

import type { ChatRepository } from "../chat/chat.repository.js"
import type { UserService } from "../user/user.service.js"
import { MessageRepository } from "./message.repository.js"
import type { SocketService } from "../../socket/services/socket.service.js"

interface IMessageServiceDeps {
  messageRepository: MessageRepository
  userService: UserService
  chatRepository: ChatRepository
  uploadOnCloudinary: typeof uploadOnCloudinary
  socketService: SocketService
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

    const userSent: any = await userService.getUser(sender)

    if (!userSent) {
      throw new ApiError(404, "User not fouond")
    }

    const chat = await chatRepository.findById(chatId)

    if (!chat) {
      throw new ApiError(404, "Chat not found.")
    }

    const messages = []

    // If there is no image and message is empty then throw error, because message must contain either text or image
    if ((!uploadedImages || uploadedImages?.length < 1) && !message) {
      throw new ApiError(400, "Invalid message data")
    }

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
        sender: {
          _id: userSent._id,
          username: userSent.username,
          imageUrl: userSent.username,
        },
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
        console.log("Error uploading image to cloudinary", error)
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

    let receiver: string = ""

    for (let i = 0; i < chat.users.length; i++) {
      if (String(chat.users[i]) !== sender) {
        receiver = String(chat.users[i])
      }
    }

    this.deps.socketService.emit_messages(
      chatId,
      messages as unknown as newMessageType[],
      receiver
    )

    return messages
  }

  async deleteMessage({
    messageId,
    userId,
  }: {
    messageId: string
    userId: string
  }): Promise<TDeletedMessageResponse> {
    const { messageRepository } = this.deps

    const deleteMessage = await messageRepository.findByIdAndDeleteMessage({
      messageId,
      userId,
    })

    if (!deleteMessage) {
      throw new ApiError(404, "Message not found")
    }

    return {
      messageId: deleteMessage._id?.toString() ?? "",
      chatId: deleteMessage.chatId.toString(),
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
    const { messageRepository, socketService } = this.deps

    let statusQuery = ["sent"]
    if (status === "seen") {
      statusQuery.push("receive")
    }

    const messages = await messageRepository.updateMessagesStatus({
      userId,
      status,
      chatId,
    })

    socketService.emit_messages_status(chatId, {
      chatId,
      receiver: userId,
      status: status as "receive" | "seen",
      numberOfMessages: messages.modifiedCount,
    })

    return messages
  }

  async updateMessageStatus({
    messageId,
    status,
    userId,
  }: {
    messageId: string
    status: string
    userId: string
  }) {
    const message =
      await this.deps.messageRepository.findByIdAndUpdateMessageStatus({
        messageId,
        status,
      })

    if (!message) {
      throw new ApiError(404, "Message not found.")
    }

    this.deps.socketService.emit_message_status(String(message?.chatId), {
      chatId: String(message.chatId),
      messageId,
      receiver: userId,
      status: status as "seen" | "receive",
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
    const { messageRepository, socketService } = this.deps

    const messages = await messageRepository.findMessagesByChatId({
      chatId,
      userId,
      limit,
      cursor,
    })

    const hasMore = messages.length === limit
    const nextCursor = hasMore ? messages[0]._id.toString() : null

    const unreadMessages = await messageRepository.countUnreadMessages(
      chatId,
      userId
    )

    socketService.emit_messages_status(chatId, {
      chatId,
      numberOfMessages: unreadMessages,
      receiver: userId,
      status: "seen",
    })

    return {
      messages,
      hasMore,
      nextCursor,
    }
  }
}
