import { UseFilters } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WsException,
} from '@nestjs/websockets';
import {
  type CreateChat,
  type CreateMessage,
  type MessageStatus,
  SOCKET_EVENTS,
  type UpdateMessagesStatus,
} from 'shared';
import { Server, Socket } from 'socket.io';
import { WsCatchAllFilter } from 'src/common/filters/ws-exception.filter';
import { PresenceRepository } from 'src/core/redis/repositories/presence.repository';
import { ChatsService } from 'src/modules/chats/chats.service';
import { MessagesService } from 'src/modules/messages/messages.service';

@UseFilters(WsCatchAllFilter)
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
    private readonly messagesService: MessagesService,
  ) {}

  // TODO: Validate data
  @SubscribeMessage(SOCKET_EVENTS.CREATE_NEW_CHAT)
  async handleCreateNewChat(
    @MessageBody() data: CreateChat,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const userId = this.getUserId(client);

      if (!userId) {
        throw new WsException('Unauthorized');
      }

      const createdChat = await this.chatsService.createChat(data, userId);

      const roomName = this.getRoomName(createdChat.id);

      await client.join(roomName);
      await this.presenceRepository.addParticipantToRoom(createdChat.id, {
        socketId: client.id,
        userId,
      });

      console.log(
        `[CHAT ROOM] User ${userId} joined room channel: ${roomName}`,
      );

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
    } catch (error) {
      console.error(`Failed to create chat: ${(error as Error).message}`);
      throw new WsException('Failed to create chat due to a database error');
    }
  }

  @SubscribeMessage(SOCKET_EVENTS.CREATE_NEW_MESSAGE)
  async handleCreateNewMessage(
    @MessageBody() data: CreateMessage,
    @ConnectedSocket() client: Socket,
  ) {
    const userId = this.getUserId(client);

    if (!userId) {
      throw new WsException('Unauthorized');
    }

    const createdMessage = await this.messagesService.createMessage(
      data,
      userId,
    );

    const roomName = this.getRoomName(data.chatId);
    const roomUsers = await this.presenceRepository.getActiveChatRoom(roomName);
    const activeUserIds = new Set(roomUsers?.users.map((u) => u.userId) ?? []);

    // If a user hasn't joined chat, we will directly emit to their socket id
    for (const messageMem of createdMessage.statuses) {
      if (!messageMem.userId) continue;
      if (messageMem.userId === userId) continue; // sender
      if (activeUserIds.has(messageMem.userId)) continue; // covered by room broadcast

      const presence = await this.presenceRepository.getUserPresence(
        messageMem.userId,
      );

      if (!presence) continue; // fully offline

      this.server
        .to(presence.socketId)
        .emit(SOCKET_EVENTS.NEW_MESSAGE_CREATED, createdMessage);
    }

    this.server
      .to(roomName)
      .except(client.id)
      .emit(SOCKET_EVENTS.NEW_MESSAGE_CREATED, createdMessage);

    return createdMessage;
  }

  @SubscribeMessage(SOCKET_EVENTS.JOIN_CHAT)
  async handleJoinChat(
    @MessageBody() data: { chatId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const userId = this.getUserId(client);
    if (!userId) {
      throw new WsException('Unauthorized');
    }

    const roomName = this.getRoomName(data.chatId);
    await client.join(roomName);

    await this.presenceRepository.addParticipantToRoom(data.chatId, {
      socketId: client.id,
      userId: userId,
    });

    console.log(`[CHAT ROOM] User ${userId} joined room channel: ${roomName}`);
    return { chatId: data.chatId, success: true };
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
    return { chatId: data.chatId, success: true };
  }

  @SubscribeMessage(SOCKET_EVENTS.UPDATE_MESSAGE_STATUS)
  async handleUpdateMessageStatus(
    @MessageBody() data: MessageStatus,
    @ConnectedSocket() client: Socket,
  ) {
    const userId = this.getUserId(client);

    if (!userId) {
      throw new WsException('Unauthorized');
    }

    const updatedMessage = await this.messagesService.updateMessageStatus(
      userId,
      data.messageId,
      data.status,
    );

    // Only notify message sender
    const message = await this.messagesService.getMessageById(data.messageId);

    const presence = await this.presenceRepository.getUserPresence(
      message.sender.id,
    );

    if (presence) {
      this.server
        .to(presence.socketId)
        .emit(SOCKET_EVENTS.UPDATED_MESSAGE_STATUS, message);
    }

    return updatedMessage;
  }

  @SubscribeMessage(SOCKET_EVENTS.UPDATE_ALL_MESSAGES_STATUSES)
  async handleUpdateChatMessagesStatus(
    @MessageBody() data: UpdateMessagesStatus,
    @ConnectedSocket() client: Socket,
  ) {
    const userId = this.getUserId(client);

    if (!userId) {
      throw new WsException('Unauthorized');
    }

    await this.messagesService.updateMessagesStatusByChatId(
      userId,
      data.chatId,
      data.status,
    );

    const chat = await this.chatsService.getChatWithMembers(data.chatId);

    if (chat.isGroup) {
      // Only notify message sender
      const sender = chat.members.filter((memb) => memb.userId !== userId);

      const presence = await this.presenceRepository.getUserPresence(
        sender[0].userId,
      );

      if (presence) {
        this.server
          .to(presence.socketId)
          .emit(SOCKET_EVENTS.UPDATED_ALL_MESSAGES_STATUSES, {
            // TODO: Standarize emitter type
            chatId: data.chatId,
            receiver: userId,
            status: data.status,
          });
      }
    } else {
      // TODO: If chat is a group, fetch senders and notify them.
    }

    return data;
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
