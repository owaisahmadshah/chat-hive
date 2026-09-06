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
import { and, eq, isNull, lt, ne, or, sql, desc } from 'drizzle-orm';
import { ChatMember, CursorPayload } from 'shared';
import { messageAttachments } from '../schema';

export const otherMember = alias(chatMembers, 'other_member');
export const otherUser = alias(users, 'other_user');

export const groupMember = alias(chatMembers, 'group_member');
export const groupMemberUser = alias(users, 'group_member_user');

export const lastMessageSender = alias(users, 'last_message_sender');

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

  // One row per chat: the most recent message, with its sender's username.
  buildLastMessageSubquery() {
    return this.client
      .selectDistinctOn([messages.chatId], {
        chatId: messages.chatId,
        id: messages.id,
        text: messages.text,
        senderId: messages.senderId,
        senderUsername: lastMessageSender.username,
        createdAt: messages.createdAt,
        hasAttachments: sql<boolean>`
        EXISTS (
          SELECT 1 FROM ${messageAttachments}
          WHERE ${messageAttachments.messageId} = ${messages.id}
        )
      `.as('has_attachments'),
      })
      .from(messages)
      .leftJoin(lastMessageSender, eq(lastMessageSender.id, messages.senderId))
      .orderBy(messages.chatId, desc(messages.createdAt))
      .as('last_message');
  }

  buildChatSelectFields(
    unreadSubquery: ReturnType<ChatQueryBuilder['buildUnreadMessagesSubquery']>,
    lastMessageSubquery: ReturnType<
      ChatQueryBuilder['buildLastMessageSubquery']
    >,
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
      // Deduplicate group members in jsonb_agg using DISTINCT
      members: sql<ChatMember[]>`
        jsonb_agg(
          DISTINCT jsonb_build_object(
            'id',       ${groupMember.id},
            'userId',   ${groupMemberUser.id},
            'username', ${groupMemberUser.username},
            'imageURL', ${groupMemberUser.imageURL},
            'role',     ${groupMember.role},
            'joinedAt', ${groupMember.joinedAt}
          )
        ) FILTER (WHERE ${groupMember.id} IS NOT NULL)
      `,
      lastMessage: sql<{
        id: string;
        text: string | null;
        senderId: string;
        senderUsername: string | null;
        createdAt: Date;
        hasAttachments: boolean;
      } | null>`
        CASE WHEN ${lastMessageSubquery.id} IS NULL THEN NULL ELSE
          jsonb_build_object(
            'id',             ${lastMessageSubquery.id},
            'text',           ${lastMessageSubquery.text},
            'senderId',       ${lastMessageSubquery.senderId},
            'senderUsername', ${lastMessageSubquery.senderUsername},
            'createdAt',      ${lastMessageSubquery.createdAt},
            'hasAttachments', ${lastMessageSubquery.hasAttachments}
          )
        END
      `,
    };
  }

  buildBaseChatQuery(
    userId: string,
    unreadSubquery: ReturnType<ChatQueryBuilder['buildUnreadMessagesSubquery']>,
    lastMessageSubquery: ReturnType<
      ChatQueryBuilder['buildLastMessageSubquery']
    >,
  ) {
    return (
      this.client
        .select(this.buildChatSelectFields(unreadSubquery, lastMessageSubquery))
        .from(chats)
        .innerJoin(
          chatMembers,
          and(
            eq(chatMembers.chatId, chats.id),
            eq(chatMembers.userId, userId),
            isNull(chatMembers.deletedAt),
          ),
        )
        // Only join single direct member if chat is NOT a group
        .leftJoin(
          otherMember,
          and(
            eq(chats.isGroup, false),
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
        .leftJoin(unreadSubquery, eq(unreadSubquery.chatId, chats.id))
        .leftJoin(lastMessageSubquery, eq(lastMessageSubquery.chatId, chats.id))
    );
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
