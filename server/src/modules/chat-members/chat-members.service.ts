import { Injectable } from '@nestjs/common';
import { ChatMembersRepository } from './chat-members.repository';
import { ChatMemberRole, CreateChatMember } from 'shared';
import { DBClient } from 'src/core/database/database.service';
import { assertExists, assertForbidden } from 'src/shared/assertions';

@Injectable()
export class ChatMembersService {
  constructor(private readonly chatMembersRepository: ChatMembersRepository) {}

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

    // CRITICAL RULE: Prevent leaving a chat with 0 admins
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
}
