import { Inject, Injectable } from '@nestjs/common';
import { and, eq, isNull, sql } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { ChatMemberRole, CreateChatMember } from 'shared';
import { DRIZZLE_PROVIDER } from 'src/core/config/config';
import { DBClient } from 'src/core/database/database.service';
import * as schema from 'src/core/database/schema';
import { chatMembers } from 'src/core/database/schema/chat';

@Injectable()
export class ChatMembersRepository {
  constructor(
    @Inject(DRIZZLE_PROVIDER)
    private readonly mainDb: NodePgDatabase<typeof schema>,
  ) {}

  private getClient(tx?: DBClient): DBClient {
    return tx ?? this.mainDb;
  }

  async createMembers(
    data: Omit<CreateChatMember, 'adminId'>[],
    tx?: DBClient,
  ) {
    const createdMembers = await this.getClient(tx)
      .insert(chatMembers)
      .values(data)
      .returning();

    return createdMembers;
  }

  async updateMemberRole(
    memberId: string,
    role: ChatMemberRole,
    tx?: DBClient,
  ) {
    const [updatedMember] = await this.getClient(tx)
      .update(chatMembers)
      .set({
        role: role,
      })
      .where(eq(chatMembers.id, memberId))
      .returning();

    return updatedMember;
  }

  async getMemberWithAdminsByUserId(memberUserId: string, chatId: string) {
    const adminCountSubQuery = this.getClient()
      .select({
        chatId: chatMembers.chatId,
        adminCount: sql<number>`count(*)`.mapWith(Number).as('admin_count'),
      })
      .from(chatMembers)
      .where(
        and(
          eq(chatMembers.chatId, chatId),
          eq(chatMembers.role, 'admin'),
          isNull(chatMembers.deletedAt),
        ),
      )
      .groupBy(chatMembers.chatId)
      .as('admin_counts');

    const [result] = await this.getClient()
      .select({
        member: chatMembers,
        totalAdmins: adminCountSubQuery.adminCount,
      })
      .from(chatMembers)
      .leftJoin(
        adminCountSubQuery,
        eq(chatMembers.chatId, adminCountSubQuery.chatId),
      )
      .where(
        and(
          eq(chatMembers.userId, memberUserId),
          isNull(chatMembers.deletedAt),
          eq(chatMembers.chatId, chatId),
        ),
      );

    if (!result) return null;

    return {
      ...result.member,
      totalAdmins: result.totalAdmins || 0,
    };
  }

  async getMemberById(memberId: string) {
    const [member] = await this.getClient()
      .select()
      .from(chatMembers)
      .where(and(eq(chatMembers.id, memberId), isNull(chatMembers.deletedAt)));

    return member || null;
  }

  async deleteMember(memberId: string, tx?: DBClient) {
    const [member] = await this.getClient(tx)
      .update(chatMembers)
      .set({ deletedAt: new Date() })
      .where(eq(chatMembers.id, memberId))
      .returning();

    return member;
  }
}
