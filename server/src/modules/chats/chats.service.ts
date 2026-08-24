import { Injectable } from '@nestjs/common';
import { ChatsRepository } from './repositories/chats.repository';
import {
  Chat,
  ChatMemberRole,
  decodeCursor,
  encodeCursor,
  Pagination,
  type CreateChat,
  type CreateChatMember,
  type UpdateChat,
} from 'shared';
import { DatabaseService, DBClient } from 'src/core/database/database.service';
import {
  assertBadRequest,
  assertExists,
  assertForbidden,
} from 'src/shared/assertions';
import { ChatMembersRepository } from './repositories/chat-members.repository';

@Injectable()
export class ChatsService {
  constructor(
    private readonly chatsRepository: ChatsRepository,
    private readonly databaseService: DatabaseService,
    private readonly chatMembersRepository: ChatMembersRepository,
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
            userId: userId,
          },
        ];

        if (members) {
          for (let i = 0; i < members?.length; i++)
            chatMembers.push({
              chatId: chat.id,
              role: 'member',
              userId: members[i],
            });
        }

        const createdMembers = await this.addMembers(chatMembers, tx);

        return [{ ...chat, members: createdMembers }];
      });

      return await this.getChatById(userId, chat.id);
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
      await this.addMembers([
        { chatId: existingChat.id, role: 'admin', userId: userId },
        { chatId: existingChat.id, role: 'admin', userId: consumerId },
      ]);

      return await this.getChatById(userId, existingChat.id);
    }

    const [chat] = await this.databaseService.transaction(async (tx) => {
      const chat = await this.chatsRepository.createChat(data, tx);

      const members = await this.addMembers(
        [
          { chatId: chat.id, role: 'admin', userId: userId },
          { chatId: chat.id, role: 'admin', userId: consumerId },
        ],
        tx,
      );

      return [{ ...chat, members }];
    });

    return await this.getChatById(userId, chat.id);
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

  async addMembersWithAdmin(
    members: CreateChatMember[],
    adminUserId: string,
    chatId: string,
    tx?: DBClient,
  ) {
    await this.validateAdmin(adminUserId, chatId);
    return await this.addMembers(members, tx);
  }

  async addMembers(data: CreateChatMember[], tx?: DBClient) {
    // TODO: Check if user already exists

    const addedMembers = await this.chatMembersRepository.createMembers(
      data,
      tx,
    );

    return addedMembers;
  }

  async changeRole(
    adminUserId: string,
    memberId: string,
    chatId: string,
    role: ChatMemberRole,
    tx?: DBClient,
  ) {
    const member = await this.chatMembersRepository.getMemberById(memberId);

    assertExists(member, 'Target member not found');
    await this.validateAdmin(adminUserId, chatId, {
      newRole: role,
      targetMemberId: memberId,
    });

    const updatedMember = await this.chatMembersRepository.updateMemberRole(
      memberId,
      role,
      tx,
    );

    return updatedMember;
  }

  async deleteMember(
    adminUserId: string,
    memberId: string,
    chatId: string,
    tx?: DBClient,
  ) {
    const member = await this.chatMembersRepository.getMemberById(memberId);
    assertExists(member, 'Target member not found');
    await this.validateAdmin(adminUserId, chatId);

    await this.chatMembersRepository.deleteMember(memberId, tx);
  }

  private async validateAdmin(
    adminUserId: string,
    chatId: string,
    options?: { targetMemberId?: string; newRole?: ChatMemberRole },
  ) {
    const adminMembership =
      await this.chatMembersRepository.getMemberWithAdminsByUserId(
        adminUserId,
        chatId,
      );

    assertExists(adminMembership, 'You are not a member of this chat');
    assertForbidden(
      adminMembership.role === 'admin',
      'Only admins can modify roles or group membership',
    );

    if (!options) return;

    const { targetMemberId, newRole } = options;

    //! CRITICAL RULE: Prevent leaving a chat with 0 admins
    if (newRole === 'member') {
      // Is the admin trying to demote themselves?
      const isDemotingSelf =
        adminMembership.id === targetMemberId ||
        adminMembership.userId === targetMemberId;

      if (isDemotingSelf) {
        assertForbidden(
          adminMembership.totalAdmins > 1,
          'Cannot demote yourself because you are the last admin. Appoint another admin first',
        );
      }
    }
  }

  async getChatMembers(chatId: string) {
    return await this.chatMembersRepository.getChatMembersById(chatId);
  }

  async deleteChatForUser(userId: string, chatId: string) {
    return await this.databaseService.transaction(async (tx) => {
      const chat = await this.chatsRepository.getChatById(chatId);
      assertExists(chat, 'Chat not found');

      const member = await this.chatMembersRepository.getMemberByChatAndUserId(
        chatId,
        userId,
        tx,
      );

      assertExists(member, 'You are not a member of this chat');

      // If user already deleted this chat, return early
      if (member.deletedAt) {
        return { chatId, message: 'Chat already deleted for user' };
      }

      // Mark member as soft-deleted for this user
      await this.chatMembersRepository.softDeleteMember(member.id, tx);

      // Count remaining active members
      const activeMembersCount =
        await this.chatMembersRepository.countActiveMembers(chatId, tx);

      // If no active members remain, hard delete the entire chat
      if (activeMembersCount === 0) {
        await this.chatsRepository.hardDeleteChat(chatId, tx);
        return { chatId, message: 'Chat permanently deleted' };
      }

      return { chatId, message: 'Chat deleted for user' };
    });
  }
}
