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
      const chatDetails = await chatRepository.findChatDetailsById({
        id: existingChat._id as string,
        uid: userId,
      })

      return chatDetails[0]
    }

    const deletedBy = users.filter((id) => id != userId)

    const newChat = await chatRepository.createChat({ users, deletedBy })

    const chatDetails = await chatRepository.findChatDetailsById({
      id: newChat._id as string,
      uid: userId,
    })

    return chatDetails[0]
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

    return { _id: deletedChat._id, users: deletedChat.users }
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
    const nextCursor = hasMore ? chats.at(-1)?.updatedAt ?? null : null

    return { chats, hasMore, nextCursor }
  }

  async getAndUpdateChat({
    chatId,
    userId,
  }: {
    chatId: string
    userId: string
  }) {
    const { chatRepository } = this.deps

    const existedChat = await chatRepository.findById(chatId)

    if (!existedChat) {
      throw new ApiError(404, "Chat not found")
    }

    const chat = await chatRepository.findChatDetailsById({
      id: chatId,
      uid: userId,
    })

    return chat[0]
  }
}
