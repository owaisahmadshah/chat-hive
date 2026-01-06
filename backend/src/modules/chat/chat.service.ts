import { ApiError } from "../../shared/utils/ApiError.js"
import type { ChatRepository } from "./chat.repository.js"

interface IChatServiceDeps {
  chatRepository: ChatRepository
}

export class ChatService {
  constructor(private deps: IChatServiceDeps) {}

  // Users are unique and doesn't include admin
  async createChat(users: string[], userId: string) {
    const { chatRepository } = this.deps

    const existingChat = await chatRepository.findChat(users)

    if (existingChat) {
      existingChat.deletedBy = existingChat.deletedBy.filter(
        (id) => id.toString() != userId
      )

      await chatRepository.save(existingChat)
      const chatDetails = await chatRepository.findCreateChatDetails(
        existingChat._id as string
      )
      chatDetails[0].lastMessage = {
        isPhoto: false,
        message: "",
      }

      return chatDetails
    }

    const deletedBy = users.filter((id) => id != userId)

    const newChat = await chatRepository.createChat({ users, deletedBy })

    const chatDetails = await chatRepository.findCreateChatDetails(
      newChat._id as string
    )

    chatDetails[0].lastMessage = {
      isPhoto: false,
      message: "",
    }

    return chatDetails
  }

  async deleteChat({ userId, chatId }: { userId: string; chatId: string }) {
    const { chatRepository } = this.deps

    const deletedChat = await chatRepository.findByIdAndUpdateChat(
      chatId,
      userId
    )

    if (!deletedChat) {
      throw new ApiError(404, "Chat not found.")
    }

    await chatRepository.deleteBulkMessage(chatId, userId)

    return deletedChat
  }

  async getUserChats({
    userId,
    limit,
    cursor,
  }: {
    userId: string
    limit: number
    cursor: string | null
  }) {
    const { chatRepository } = this.deps

    const chats = await chatRepository.findUserChats({ userId, limit, cursor })

    const hasMore = chats.length === limit
    const lastChat = chats.at(-1)
    const nextCursor =
      hasMore && lastChat?.updatedAt ? lastChat.updatedAt : null

    return { chats, hasMore, nextCursor }
  }

  async getChatsAndMessages({ userId }: { userId: string }) {
    const { chatRepository } = this.deps

    const chats = await chatRepository.findChats(userId)

    for (let i = 0; i < chats?.length; i++) {
      const { messages, unreadMessages, numberOfMessages } =
        await this.getMessages({
          chatId: chats[i]._id.toString(),
          userId: userId,
          numberOfMessagesUserHave: 0,
          unreadMessagesFlag: true,
        })

      chats[i].messages = [...messages]
      chats[i].unreadMessages = unreadMessages
      chats[i].numberOfMessages = numberOfMessages

      const lastMessage = {
        isPhoto: false,
        message: "",
      }

      if (messages.length) {
        lastMessage.isPhoto = messages[messages.length - 1].photoUrl !== ""
        lastMessage.message = messages[messages.length - 1].message
      }

      chats[i].lastMessage = lastMessage
    }

    return chats
  }

  async getMessages({
    chatId,
    userId,
    numberOfMessagesUserHave,
    unreadMessagesFlag = false,
  }: {
    chatId: string
    userId: string
    numberOfMessagesUserHave: number
    unreadMessagesFlag: boolean
  }) {
    const { chatRepository } = this.deps
    let defaultNumberOfMessagesUserFetch = 30

    let unreadMessages = 0
    if (unreadMessagesFlag) {
      unreadMessages = await chatRepository.countUnreadMessages(userId, chatId)
    }

    if (!unreadMessagesFlag) {
      defaultNumberOfMessagesUserFetch = 10
    }

    const messages = await chatRepository.findMessages({
      chat_id: chatId,
      user_id: userId,
      limit:
        numberOfMessagesUserHave +
        unreadMessages +
        defaultNumberOfMessagesUserFetch,
      skip: numberOfMessagesUserHave,
    })

    if (messages[0].unreadMessages.length === 0) {
      messages[0].unreadMessages.push({ totalUnreadMessages: 0 })
    }

    if (messages[0].sentMessages.length === 0) {
      messages[0].sentMessages.push({ numberOfMessages: 0 })
    }

    await chatRepository.updateBulkMessagesForReceived(chatId, userId)

    return {
      messages: messages[0].messages,
      unreadMessages: messages[0].unreadMessages[0].totalUnreadMessages,
      numberOfMessages: messages[0].sentMessages[0].numberOfMessages,
    }
  }

  async getAndUpdateChat({ chatId }: { chatId: string }) {
    const { chatRepository } = this.deps

    const existedChat = await chatRepository.findById(chatId)

    if (!existedChat) {
      return existedChat
    }

    const chat = await chatRepository.findCreateChatDetails(chatId)

    chat[0].unreadMessages = 0
    chat[0].lastMessage = {
      isPhoto: false,
      message: "",
    }

    return chat
  }

  async getMoreMessages({
    userId,
    chatId,
    userChatMessages,
  }: {
    userId: string
    chatId: string
    userChatMessages: number
  }) {
    const { messages } = await this.getMessages({
      chatId,
      userId,
      numberOfMessagesUserHave: userChatMessages,
      unreadMessagesFlag: false,
    })

    return messages
  }
}
