import { Injectable } from '@nestjs/common';
import { ChatMembersRepository } from './chat-members.repository';
import { ChatMemberRole, CreateChatMember } from 'shared';
import { DBClient } from 'src/core/database/database.service';
import { assertExists, assertForbidden } from 'src/shared/assertions';

@Injectable()
export class ChatMembersService {
  constructor(private readonly chatMembersRepository: ChatMembersRepository) {}

  async addMembersWithAdmin(data: CreateChatMember[], tx?: DBClient) {
    await this.validateAdmin(data[0].adminId, data[0].chatId);

    const dto = data.map((item) => ({
      chatId: item.chatId,
      memberId: item.memberId,
      role: item.role,
    }));

    return await this.addMembers(dto, tx);
  }

  async addMembers(data: Omit<CreateChatMember, 'adminId'>[], tx?: DBClient) {
    const addedMembers = await this.chatMembersRepository.createMembers(
      data,
      tx,
    );

    return addedMembers;
  }

  async changeRole(
    adminId: string,
    memberId: string,
    chatId: string,
    role: ChatMemberRole,
    tx?: DBClient,
  ) {
    const member = await this.chatMembersRepository.getMemberById(memberId);

    assertExists(member, 'Target member not found');
    await this.validateAdmin(adminId, chatId, role);

    const updatedMember = await this.chatMembersRepository.updateMemberRole(
      memberId,
      role,
      tx,
    );

    return updatedMember;
  }

  async deleteMember(
    adminId: string,
    memberId: string,
    chatId: string,
    tx?: DBClient,
  ) {
    const member = await this.chatMembersRepository.getMemberById(memberId);
    assertExists(member, 'Target member not found');
    await this.validateAdmin(adminId, chatId);

    await this.chatMembersRepository.deleteMember(memberId, tx);
  }

  private async validateAdmin(
    adminId: string,
    chatId: string,
    newRole?: ChatMemberRole,
  ) {
    const admin = await this.chatMembersRepository.getMemberWithAdmins(
      adminId,
      chatId,
    );

    assertExists(admin, 'Admin not found');
    assertForbidden(
      admin?.role === 'admin',
      'Only admin can change roles and group contents',
    );

    if (newRole && newRole === 'member') {
      assertForbidden(admin.totalAdmins > 1, 'Cannot change last admin role');
    }
  }
}
