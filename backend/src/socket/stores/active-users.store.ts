import { type SocketUser } from "../types/socket.type.js"

export class ActiveUsersStore {
  private activeUsers: Map<string, SocketUser> = new Map()

  add(user: SocketUser): void {
    console.log(`${user.userId} has been connected...`)
    this.activeUsers.set(user.userId, user)
  }

  get(userId: string): SocketUser | undefined {
    return this.activeUsers.get(userId)
  }

  remove(userId: string): void {
    this.activeUsers.delete(userId)
  }

  setActiveChat(userId: string, chatId: string | null): void {
    const user = this.activeUsers.get(userId)
    if (user) user.activeChat = chatId
  }

  has(userId: string): boolean {
    return this.activeUsers.has(userId)
  }
}
