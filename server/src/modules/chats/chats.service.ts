import { Injectable } from '@nestjs/common';
import { ChatsRepository } from './chats.repository';
import {
  Chat,
  decodeCursor,
  encodeCursor,
  Pagination,
  type CreateChat,
  type CreateChatMember,
  type UpdateChat,
} from 'shared';
import { DatabaseService } from 'src/core/database/database.service';
import { ChatMembersService } from '../chat-members/chat-members.service';
import {
  assertBadRequest,
  assertExists,
  assertForbidden,
} from 'src/shared/assertions';

@Injectable()
export class ChatsService {
  constructor(
    private readonly chatsRepository: ChatsRepository,
    private readonly databaseService: DatabaseService,
    private readonly chatMembersService: ChatMembersService,
  ) {}

  async createChat(data: CreateChat, userId: string) {
    if (data.isGroup) {
      const [chat] = await this.databaseService.transaction(async (tx) => {
        const { members, ...other } = data;
        const chat = await this.chatsRepository.createChat(other, tx);

        const chatMembers: Omit<CreateChatMember, 'adminId'>[] = [
          {
            chatId: chat.id,
            role: 'admin',
            memberId: userId,
          },
        ];

        if (members) {
          for (let i = 0; i < members?.length; i++)
            chatMembers.push({
              chatId: chat.id,
              role: 'member',
              memberId: members[i],
            });
        }

        const createdMembers = await this.chatMembersService.addMembers(
          chatMembers,
          tx,
        );

        return [{ ...chat, members: createdMembers }];
      });

      return chat;
    }

    assertBadRequest(
      Array.isArray(data.members) && data.members.length > 0,
      'Must provide exactly one receiver',
    );

    const consumerId = data.members.filter(
      (memberId) => memberId !== userId,
    )[0];

    const existingChat = await this.chatsRepository.getPrivateChatByMembersId(
      userId,
      consumerId,
    );

    if (existingChat) {
      const members = await this.chatMembersService.addMembers([
        { chatId: existingChat.id, role: 'admin', memberId: userId },
        { chatId: existingChat.id, role: 'admin', memberId: consumerId },
      ]);

      return { ...existingChat, members: members };
    }

    const [chat] = await this.databaseService.transaction(async (tx) => {
      const chat = await this.chatsRepository.createChat(data, tx);

      const members = await this.chatMembersService.addMembers([
        { chatId: chat.id, role: 'admin', memberId: userId },
        { chatId: chat.id, role: 'admin', memberId: consumerId },
      ]);

      return [{ ...chat, members }];
    });

    return chat;
  }

  async getMyChats(
    userId: string,
    limit: number,
    cursor: string | null,
  ): Promise<Pagination<Chat>> {
    let incommingCursor: undefined | { id: string; updatedAt: Date } =
      undefined;

    if (cursor) {
      const decodedCursor = decodeCursor(cursor);

      incommingCursor = decodedCursor?.updatedAt
        ? {
            id: decodedCursor.id,
            updatedAt: new Date(decodedCursor.updatedAt),
          }
        : undefined;
    }

    const chats = await this.chatsRepository.getPaginatedChats(
      userId,
      limit,
      incommingCursor,
    );

    const hasMore = chats.length > limit;
    const data = hasMore ? chats.slice(0, limit) : chats;
    const nextCursor = hasMore
      ? encodeCursor({
          id: data.at(-1)!.id,
          updatedAt: data.at(-1)!.updatedAt?.toISOString(),
        })
      : null;

    return { data, nextCursor, hasMore };
  }

  async getChatById(userId: string, chatId: string) {
    const chat = await this.chatsRepository.getChatWithMembersAndUnreadMessages(
      userId,
      chatId,
    );

    assertExists(chat, 'Chat not found');

    return chat;
  }

  async updateChat(chatId: string, updateData: UpdateChat) {
    const chat = await this.chatsRepository.getChatById(chatId);

    assertForbidden(chat.isGroup, 'Cannot update private chats');
    assertBadRequest(
      !!(updateData.name || updateData.logoURL),
      'Must provide name or logo url',
    );

    return await this.chatsRepository.updateChat(chatId, updateData);
  }
}
