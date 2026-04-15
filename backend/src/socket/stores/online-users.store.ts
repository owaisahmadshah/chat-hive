export class OnlineUsersStore {
  private onlineUsers: Map<string, boolean> = new Map()

  add(userId: string): void {
    this.onlineUsers.set(userId, true)
  }

  remove(userId: string): void {
    this.onlineUsers.delete(userId)
  }

  isOnline(userId: string): boolean {
    return this.onlineUsers.has(userId)
  }
}
