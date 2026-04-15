export class ChatRoomsStore {
  private chatRooms: Map<string, Set<string>> = new Map()

  add(chatId: string, userId: string): void {
    if (!this.chatRooms.has(chatId)) {
      this.chatRooms.set(chatId, new Set())
    }
    this.chatRooms.get(chatId)!.add(userId)
  }

  remove(chatId: string, userId: string): void {
    const participants = this.chatRooms.get(chatId)
    if (!participants) return
    participants.delete(userId)
    if (participants.size === 0) {
      this.chatRooms.delete(chatId)
    }
  }

  removeUserFromAll(userId: string): void {
    this.chatRooms.forEach((_, chatId) => {
      this.remove(chatId, userId)
    })
  }

  getParticipants(chatId: string): Set<string> | undefined {
    return this.chatRooms.get(chatId)
  }

  has(chatId: string, userId: string): boolean {
    return this.chatRooms.get(chatId)?.has(userId) ?? false
  }
}
