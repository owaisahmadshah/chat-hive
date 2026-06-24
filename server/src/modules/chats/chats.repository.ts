import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { and, desc, eq, isNull, lt, ne, or, sql } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import { DRIZZLE_PROVIDER } from 'src/core/config/config';
import * as schema from '../../core/database/schema';
import { DBClient } from 'src/core/database/database.service';
import { ChatMember, CreateChat, UpdateChat } from 'shared';
import { chats, chatMembers } from '../../core/database/schema/chat';
import { users } from '../../core/database/schema/user';
import {
  messages,
  messageStatus,
  messageDelete,
} from '../../core/database/schema/message';

const otherMember = alias(chatMembers, 'other_member');
const otherUser = alias(users, 'other_user');

@Injectable()
export class ChatsRepository {
  constructor(
    @Inject(DRIZZLE_PROVIDER)
    private readonly mainDb: NodePgDatabase<typeof schema>,
  ) {}

  private getClient(tx?: DBClient): DBClient {
    return tx ?? this.mainDb;
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
    const unreadSubquery = this.getClient()
      .select({
        chatId: messages.chatId,
        unreadCount: sql<number>`COUNT(*)`.as('unread_count'),
      })
      .from(messages)
      .leftJoin(
        messageStatus,
        and(
          eq(messageStatus.messageId, messages.id),
          eq(messageStatus.userId, sql`${userId}::uuid`),
        ),
      )
      .leftJoin(
        messageDelete,
        and(
          eq(messageDelete.messageId, messages.id),
          eq(messageDelete.userId, sql`${userId}::uuid`),
        ),
      )
      .where(
        and(
          ne(messages.senderId, sql`${userId}::uuid`),
          isNull(messageStatus.id),
          isNull(messageDelete.id),
        ),
      )
      .groupBy(messages.chatId)
      .as('unread');

    const rows = await this.getClient()
      .select({
        id: chats.id,
        name: sql<string>`
          CASE
            WHEN ${chats.isGroup} = true THEN ${chats.name}
            ELSE ${otherUser.username}
          END
        `,
        logoURL: sql<string>`
          CASE
            WHEN ${chats.isGroup} = true THEN ${chats.logoURL}
            ELSE ${otherUser.imageURL}
          END
        `,
        isGroup: chats.isGroup,
        updatedAt: chats.updatedAt,
        unreadCount: sql<number>`COALESCE(${unreadSubquery.unreadCount}, 0)`,
        members: sql<ChatMember[]>`
          CASE
            WHEN ${chats.isGroup} = true THEN
              jsonb_agg(
                jsonb_build_object(
                  'id',       ${chatMembers.id},
                  'userId',   ${users.id},
                  'username', ${users.username},
                  'imageURL', ${users.imageURL},
                  'role',     ${chatMembers.role},
                  'joinedAt', ${chatMembers.joinedAt}
                )
              )
            ELSE
              '[]'::jsonb
          END
        `,
      })
      .from(chats)
      .innerJoin(
        chatMembers,
        and(
          eq(chatMembers.chatId, chats.id),
          eq(chatMembers.userId, userId),
          isNull(chatMembers.deletedAt),
        ),
      )
      .innerJoin(users, eq(users.id, chatMembers.userId))
      .leftJoin(
        otherMember,
        and(
          eq(otherMember.chatId, chats.id),
          ne(otherMember.userId, userId),
          isNull(otherMember.deletedAt),
        ),
      )
      .leftJoin(otherUser, eq(otherUser.id, otherMember.userId))
      .leftJoin(unreadSubquery, eq(unreadSubquery.chatId, chats.id))
      .where(
        cursor
          ? or(
              lt(chats.updatedAt, cursor.updatedAt),
              and(
                eq(chats.updatedAt, cursor.updatedAt),
                lt(chats.id, cursor.id),
              ),
            )
          : undefined,
      )
      .groupBy(chats.id, otherUser.username, otherUser.imageURL)
      .orderBy(desc(chats.updatedAt), desc(chats.id))
      .limit(limit + 1);

    return rows;
  }

  async getChatWithMembersAndUnreadMessages(userId: string, chatId: string) {
    const unreadSubquery = this.getClient()
      .select({
        chatId: messages.chatId,
        unreadCount: sql<number>`COUNT(*)`.as('unread_count'),
      })
      .from(messages)
      .leftJoin(
        messageStatus,
        and(
          eq(messageStatus.messageId, messages.id),
          eq(messageStatus.userId, sql`${userId}::uuid`),
        ),
      )
      .leftJoin(
        messageDelete,
        and(
          eq(messageDelete.messageId, messages.id),
          eq(messageDelete.userId, sql`${userId}::uuid`),
        ),
      )
      .where(
        and(
          ne(messages.senderId, sql`${userId}::uuid`),
          isNull(messageStatus.id),
          isNull(messageDelete.id),
        ),
      )
      .groupBy(messages.chatId)
      .as('unread');

    const rows = await this.getClient()
      .select({
        id: chats.id,
        isGroup: chats.isGroup,
        updatedAt: chats.updatedAt,
        unreadCount: sql<number>`COALESCE(${unreadSubquery.unreadCount}, 0)`,
        name: sql<string>`
          CASE
            WHEN ${chats.isGroup} = true THEN ${chats.name}
            ELSE ${otherUser.username}
          END
        `,
        logoURL: sql<string>`
          CASE
            WHEN ${chats.isGroup} = true THEN ${chats.logoURL}
            ELSE ${otherUser.imageURL}
          END
        `,
        members: sql<ChatMember[]>`
          CASE
            WHEN ${chats.isGroup} = true THEN
              jsonb_agg(
                jsonb_build_object(
                  'id',       ${chatMembers.id},
                  'userId',   ${users.id},
                  'username', ${users.username},
                  'imageURL', ${users.imageURL},
                  'role',     ${chatMembers.role},
                  'joinedAt', ${chatMembers.joinedAt}
                )
              )
            ELSE
              '[]'::jsonb
          END
        `,
      })
      .from(chats)
      .innerJoin(
        chatMembers,
        and(
          eq(chatMembers.chatId, chats.id),
          eq(chatMembers.userId, userId),
          isNull(chatMembers.deletedAt),
        ),
      )
      .innerJoin(users, eq(users.id, chatMembers.userId))
      .leftJoin(
        otherMember,
        and(
          eq(otherMember.chatId, chats.id),
          ne(otherMember.userId, userId),
          isNull(otherMember.deletedAt),
        ),
      )
      .leftJoin(otherUser, eq(otherUser.id, otherMember.userId))
      .leftJoin(unreadSubquery, eq(unreadSubquery.chatId, chats.id))
      .where(eq(chats.id, chatId))
      .groupBy(
        chats.id,
        otherUser.username,
        otherUser.imageURL,
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
