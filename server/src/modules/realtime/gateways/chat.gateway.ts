import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { type CreateChat, SOCKET_EVENTS } from 'shared';
import { Server, Socket } from 'socket.io';
import { PresenceRepository } from 'src/core/redis/repositories/presence.repository';
import { ChatsService } from 'src/modules/chats/chats.service';

@WebSocketGateway({
  namespace: '/chat',
  cors: { origin: process.env.CLIENT_URL, credentials: true },
})
export class ChatGateway {
  @WebSocketServer()
  server!: Server;

  constructor(
    private readonly presenceRepository: PresenceRepository,
    private readonly chatsService: ChatsService,
  ) {}

  // TODO: Validate data
  @SubscribeMessage(SOCKET_EVENTS.CREATE_NEW_CHAT)
  async handleCreateNewChat(
    @MessageBody() data: CreateChat,
    @ConnectedSocket() client: Socket,
  ) {
    const userId = this.getUserId(client);

    if (!userId) {
      return {
        event: 'error',
        data: { message: 'Unauthorized profile tracking context' },
      };
    }

    const createdChat = await this.chatsService.createChat(data, userId);

    const roomName = this.getRoomName(createdChat.id);

    await client.join(roomName);
    await this.presenceRepository.addParticipantToRoom(createdChat.id, {
      socketId: client.id,
      userId,
    });

    console.log(`[CHAT ROOM] User ${userId} joined room channel: ${roomName}`);

    if (createdChat.isGroup) {
      for (const member of createdChat.members) {
        const presence = await this.presenceRepository.getUserPresence(
          member.userId,
        );

        if (!presence) continue;

        this.server
          .to(presence.socketId)
          .emit(SOCKET_EVENTS.NEW_CHAT_CREATED, createdChat);
      }
    }

    return createdChat;
  }

  @SubscribeMessage(SOCKET_EVENTS.JOIN_CHAT)
  async handleJoinChat(
    @MessageBody() data: { chatId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const userId = this.getUserId(client);
    if (!userId) {
      return {
        event: 'error',
        data: { message: 'Unauthorized profile tracking context' },
      };
    }

    const roomName = this.getRoomName(data.chatId);
    await client.join(roomName);

    await this.presenceRepository.addParticipantToRoom(data.chatId, {
      socketId: client.id,
      userId: userId,
    });

    console.log(`[CHAT ROOM] User ${userId} joined room channel: ${roomName}`);
    return { event: 'joinedChat', data: { chatId: data.chatId } };
  }

  @SubscribeMessage(SOCKET_EVENTS.LEAVE_CHAT)
  async handleLeaveChat(
    @MessageBody() data: { chatId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const roomName = this.getRoomName(data.chatId);
    await client.leave(roomName);

    await this.presenceRepository.removeParticipantFromRoom(
      data.chatId,
      client.id,
    );

    console.log(
      `[CHAT ROOM] Socket ${client.id} backed out of channel: ${roomName}`,
    );
    return { chatId: data.chatId, status: true };
  }

  private getUserId(client: Socket) {
    const userIdHeader = client.handshake.headers['user-id'];
    const userId =
      client.user?.sub ||
      (Array.isArray(userIdHeader) ? userIdHeader[0] : userIdHeader);

    return userId;
  }

  private getRoomName(chatId: string) {
    return `chat:${chatId}`;
  }
}
