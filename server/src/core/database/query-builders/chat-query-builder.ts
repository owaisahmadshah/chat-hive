import { alias } from 'drizzle-orm/pg-core';
import {
  chatMembers,
  chats,
  messageDelete,
  messages,
  messageStatus,
  users,
} from '../schema';
import { DBClient } from '../database.service';
import { and, eq, isNull, lt, ne, or, sql } from 'drizzle-orm';
import { ChatMember, CursorPayload } from 'shared';

export const otherMember = alias(chatMembers, 'other_member');
export const otherUser = alias(users, 'other_user');

// ======== Chat Query Builder ===========
export class ChatQueryBuilder {
  constructor(private readonly client: DBClient) {}

  buildUnreadMessagesSubquery(userId: string, chatId?: string) {
    const conditions = [
      ne(messages.senderId, sql`${userId}::uuid`),
      isNull(messageStatus.id),
      isNull(messageStatus.id),
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
      .where(and(...conditions))
      .as('unread');
  }

  buildChatSelectFields(
    unreadSubquery: ReturnType<ChatQueryBuilder['buildUnreadMessagesSubquery']>,
  ) {
    return {
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
