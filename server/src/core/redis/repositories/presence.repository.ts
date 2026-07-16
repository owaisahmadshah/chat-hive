import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { CACHE_TTL, REDIS_KEYS, REDIS_PROVIDER } from '../../config/config';

export type UserStatus = 'online' | 'offline';

export interface UserPresence {
  socketId: string;
  status: UserStatus;
}

export interface ChatParticipant {
  socketId: string;
  userId: string;
}

export interface ActiveChatRoom {
  roomId: string;
  users: ChatParticipant[];
}

@Injectable()
export class PresenceRepository {
  constructor(
    @Inject(REDIS_PROVIDER)
    private readonly redis: Redis,
  ) {}

  // USER PRESENCE MANAGEMENT

  // Sets or updates a user's real-time connection status.
  async setUserPresence(userId: string, presence: UserPresence): Promise<void> {
    const key = REDIS_KEYS.userPresence(userId);

    await this.redis
      .multi()
      .hset(key, {
        socketId: presence.socketId,
        status: presence.status,
      })
      .expire(key, CACHE_TTL.PRESENCE_DEFAULT_SECONDS) // Fallback TTL to prevent memory leaks if disconnect hooks crash
      .exec();
  }

  // Fetches a specific user's current status and socket identifier.
  async getUserPresence(userId: string): Promise<UserPresence | null> {
    const key = REDIS_KEYS.userPresence(userId);
    const data = await this.redis.hgetall(key);

    if (!data || !data.socketId || !data.status) {
      return null;
    }

    return {
      socketId: data.socketId,
      status: data.status as UserStatus,
    };
  }

  // Removes a user completely from active presence tracking on total disconnect.
  async removeUserPresence(userId: string): Promise<void> {
    const key = REDIS_KEYS.userPresence(userId);
    await this.redis.del(key);
  }

  async updateUserStatus(userId: string, status: UserStatus): Promise<void> {
    const key = REDIS_KEYS.userPresence(userId);

    // Verify the connection exists first to avoid creating dead keys
    const exists = await this.redis.exists(key);
    if (exists) {
      await this.redis.hset(key, 'status', status);
    }
  }

  // CHAT ROOM MANAGEMENT

  // Caches or updates an active chat room workspace context.
  async setActiveChatRoom(chatId: string, room: ActiveChatRoom): Promise<void> {
    const key = REDIS_KEYS.chatRoom(chatId);

    await this.redis
      .multi()
      .hset(key, {
        roomId: room.roomId,
        users: JSON.stringify(room.users), // Serialize array safely into a hash field
      })
      .expire(key, CACHE_TTL.PRESENCE_DEFAULT_SECONDS)
      .exec();
  }

  // Retrieves active metadata and users attached to a specific chat identifier.
  async getActiveChatRoom(chatId: string): Promise<ActiveChatRoom | null> {
    const key = REDIS_KEYS.chatRoom(chatId);
    const data = await this.redis.hgetall(key);

    if (!data || !data.roomId || !data.users) {
      return null;
    }

    try {
      return {
        roomId: data.roomId,
        users: JSON.parse(data.users) as ChatParticipant[],
      };
    } catch {
      return null; // Fallback for data corruption safely
    }
  }

  // Safely adds a single participant to an active room without overwriting others.
  async addParticipantToRoom(
    chatId: string,
    participant: ChatParticipant,
  ): Promise<void> {
    const currentRoom = await this.getActiveChatRoom(chatId);

    // Fallback if room isn't established in cache yet
    const baseRoom: ActiveChatRoom = currentRoom ?? {
      roomId: `chat:${chatId}`,
      users: [],
    };

    // Filter out existing instances of this user/socket to avoid duplicates
    const updatedUsers = baseRoom.users.filter(
      (u) =>
        u.userId !== participant.userId && u.socketId !== participant.socketId,
    );
    updatedUsers.push(participant);

    baseRoom.users = updatedUsers;
    await this.setActiveChatRoom(chatId, baseRoom);
  }

  // Safely removes a participant from an active room when they trigger leave events.
  async removeParticipantFromRoom(
    chatId: string,
    socketId: string,
  ): Promise<void> {
    const currentRoom = await this.getActiveChatRoom(chatId);
    if (!currentRoom) return;

    const updatedUsers = currentRoom.users.filter(
      (u) => u.socketId !== socketId,
    );

    if (updatedUsers.length === 0) {
      // Clear key entirely if no one is looking at the chat room anymore
      await this.redis.del(REDIS_KEYS.chatRoom(chatId));
    } else {
      currentRoom.users = updatedUsers;
      await this.setActiveChatRoom(chatId, currentRoom);
    }
  }
}
