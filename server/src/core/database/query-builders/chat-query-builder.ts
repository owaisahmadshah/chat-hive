import { alias } from 'drizzle-orm/pg-core';
import {
  chatMembers,
  chats,
  messageDelete,
  messages,
  messageStatus,
  users,
} from '../schema';
import { type DBClient } from '../database.service';
import { and, eq, isNull, lt, ne, or, sql } from 'drizzle-orm';
import { ChatMember, CursorPayload } from 'shared';

export const otherMember = alias(chatMembers, 'other_member');
export const otherUser = alias(users, 'other_user');

export const groupMember = alias(chatMembers, 'group_member');
export const groupMemberUser = alias(users, 'group_member_user');

// ======== Chat Query Builder ===========
export class ChatQueryBuilder {
  constructor(private readonly client: DBClient) {}

  buildUnreadMessagesSubquery(userId: string, chatId?: string) {
    const conditions = [
      ne(messages.senderId, sql`${userId}::uuid`),
      ne(messageStatus.status, 'read'),
      isNull(messageDelete.id),
    ];

    if (chatId) {
      conditions.push(eq(messages.chatId, sql`${chatId}::uuid`));
    }

    return this.client
      .select({
        chatId: messages.chatId,
        unreadCount: sql<number>`COUNT(*)`.as('unread_count'),
      })
      .from(messages)
      .innerJoin(
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
      .where(and(...conditions))
      .groupBy(messages.chatId)
      .as('unread');
  }

  buildChatSelectFields(
    unreadSubquery: ReturnType<ChatQueryBuilder['buildUnreadMessagesSubquery']>,
  ) {
    return {
      id: chats.id,
      isGroup: chats.isGroup,
      updatedAt: chats.updatedAt,
      unreadCount: sql<number>`COALESCE(${unreadSubquery.unreadCount}, 0)::int`,

      name: sql<string>`
        CASE WHEN ${chats.isGroup} = true THEN ${chats.name}
        ELSE ${otherUser.username} END
      `,
      logoURL: sql<string>`
        CASE WHEN ${chats.isGroup} = true THEN ${chats.logoURL}
        ELSE ${otherUser.imageURL} END
      `,
      members: sql<ChatMember[]>`
        jsonb_agg(
          jsonb_build_object(
            'id',       ${groupMember.id},
            'userId',   ${groupMemberUser.id},
            'username', ${groupMemberUser.username},
            'imageURL', ${groupMemberUser.imageURL},
            'role',     ${groupMember.role},
            'joinedAt', ${groupMember.joinedAt}
          )
        ) FILTER (WHERE ${groupMember.id} IS NOT NULL)
      `,
    };
  }

  buildBaseChatQuery(
    userId: string,
    unreadSubquery: ReturnType<ChatQueryBuilder['buildUnreadMessagesSubquery']>,
  ) {
    return this.client
      .select(this.buildChatSelectFields(unreadSubquery))
      .from(chats)
      .innerJoin(
        chatMembers,
        and(
          eq(chatMembers.chatId, chats.id),
          eq(chatMembers.userId, userId),
          isNull(chatMembers.deletedAt),
        ),
      )
      .leftJoin(
        otherMember,
        and(
          eq(otherMember.chatId, chats.id),
          ne(otherMember.userId, userId),
          isNull(otherMember.deletedAt),
        ),
      )
      .leftJoin(otherUser, eq(otherUser.id, otherMember.userId))
      .leftJoin(
        groupMember,
        and(eq(groupMember.chatId, chats.id), isNull(groupMember.deletedAt)),
      )
      .leftJoin(groupMemberUser, eq(groupMemberUser.id, groupMember.userId))
      .leftJoin(unreadSubquery, eq(unreadSubquery.chatId, chats.id));
  }

  buildCursorCondition(
    cursor?: Omit<CursorPayload, 'updatedAt'> & { updatedAt: Date },
  ) {
    if (!cursor) return undefined;

    return or(
      lt(chats.updatedAt, cursor.updatedAt),
      and(eq(chats.updatedAt, cursor.updatedAt), lt(chats.id, cursor.id)),
    );
  }
}
