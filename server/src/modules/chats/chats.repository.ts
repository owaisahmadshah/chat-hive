import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { and, desc, eq, isNull, sql } from 'drizzle-orm';
import { DRIZZLE_PROVIDER } from 'src/core/config/config';
import * as schema from '../../core/database/schema';
import { DBClient } from 'src/core/database/database.service';
import { chats, chatMembers } from '../../core/database/schema/chat';
import { CreateChat, UpdateChat } from 'shared';
import { ChatQueryBuilder } from 'src/core/database/query-builders/chat-query-builder';

@Injectable()
export class ChatsRepository {
  constructor(
    @Inject(DRIZZLE_PROVIDER)
    private readonly mainDb: NodePgDatabase<typeof schema>,
  ) {}

  private getClient(tx?: DBClient): DBClient {
    return tx ?? this.mainDb;
  }

  private getQueryBuilder(tx?: DBClient): ChatQueryBuilder {
    return new ChatQueryBuilder(this.getClient(tx));
  }

  async createChat(data: CreateChat, tx?: DBClient) {
    const [result] = await this.getClient(tx)
      .insert(chats)
      .values(data)
      .returning();

    return result;
  }

  async getPaginatedChats(
    userId: string,
    limit: number,
    cursor?: {
      id: string;
      updatedAt: Date;
    },
  ) {
    const qb = this.getQueryBuilder();
    const unreadMessagesSubQuery = qb.buildUnreadMessagesSubquery(userId);

    const rows = await qb
      .buildBaseChatQuery(userId, unreadMessagesSubQuery)
      .where(qb.buildCursorCondition(cursor))
      .groupBy(chats.id, schema.users.username, schema.users.imageURL)
      .orderBy(desc(chats.updatedAt), desc(chats.id))
      .limit(limit + 1);

    return rows;
  }

  async getChatWithMembersAndUnreadMessages(userId: string, chatId: string) {
    const qb = this.getQueryBuilder();
    const unreadSubquery = qb.buildUnreadMessagesSubquery(userId, chatId);

    const rows = await qb
      .buildBaseChatQuery(userId, unreadSubquery)
      .where(eq(chats.id, chatId))
      .groupBy(
        chats.id,
        schema.users.username,
        schema.users.imageURL,
        unreadSubquery.unreadCount,
      );

    return rows[0] || null;
  }

  async getPrivateChatByMembersId(actorId: string, consumerId: string) {
    const [chat] = await this.getClient()
      .select({ id: chats.id })
      .from(chats)
      .innerJoin(
        chatMembers,
        and(eq(chats.id, chatMembers.chatId), isNull(chatMembers.deletedAt)),
      )
      .where(eq(chats.isGroup, false))
      .groupBy(chats.id)
      .having(
        and(
          sql`count(case when ${chatMembers.deletedAt} is null then 1 end) = 2`,
          sql`count(case when ${chatMembers.userId} in (${actorId}, ${consumerId}) and ${chatMembers.deletedAt} is null then 1 end) = 2`,
        ),
      )
      .limit(1);

    return chat || null;
  }

  async updateChat(chatId: string, updateData: UpdateChat) {
    const [updatedChat] = await this.getClient()
      .update(chats)
      .set(updateData)
      .where(eq(chats.id, chatId))
      .returning();

    return updatedChat;
  }

  async getChatById(chatId: string) {
    const [chat] = await this.getClient()
      .select()
      .from(chats)
      .where(eq(chats.id, chatId));

    return chat;
  }
}
