import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { alias } from 'drizzle-orm/pg-core';
import { and, eq, lt, or, sql } from 'drizzle-orm';
import { CreateMessage, Message, ReplyToMessageRecord } from 'shared';
import { DRIZZLE_PROVIDER } from 'src/core/config/config';
import { DBClient } from 'src/core/database/database.service';
import * as schema from 'src/core/database/schema';
import {
  messages,
  users,
  messageAttachments,
  messageStatus,
} from 'src/core/database/schema';

const replyToMessage = alias(messages, 'reply_message');

@Injectable()
export class MessagesRepository {
  constructor(
    @Inject(DRIZZLE_PROVIDER)
    private readonly mainDb: NodePgDatabase<typeof schema>,
  ) {}

  private getClient(tx?: DBClient): DBClient {
    return tx ?? this.mainDb;
  }

  async createMessages(
    data: Omit<CreateMessage, 'attachments'>,
    tx?: DBClient,
  ) {
    const [createdMessage] = await this.getClient(tx)
      .insert(messages)
      .values({
        chatId: data.chatId,
        senderId: data.senderId!,
        text: data.text,
        replyTo: data.replyTo,
      })
      .returning({
        id: messages.id,
        chatId: messages.chatId,
        senderId: messages.senderId,
        text: messages.text,
        replyTo: messages.replyTo,
        createdAt: messages.createdAt,
      });

    return createdMessage;
  }

  async getMessageById(messageId: string, tx?: DBClient) {
    const [message] = await this.getClient(tx)
      .select({
        id: messages.id,
        chatId: messages.chatId,
        text: messages.text,
        replyTo: sql<ReplyToMessageRecord>`
          CASE
            WHEN ${messages.replyTo} IS NOT NULL THEN
              jsonb_build_object(
                'id',       ${replyToMessage.id},
                'text',     ${replyToMessage.text},
                'senderId', ${replyToMessage.senderId}
              )
            ELSE NULL
          END
        `,
        createdAt: messages.createdAt,
        sender: {
          id: users.id,
          username: users.username,
          imageURL: users.imageURL,
        },
      })
      .from(messages)
      .innerJoin(users, eq(messages.senderId, users.id))
      .leftJoin(replyToMessage, eq(replyToMessage.id, messages.replyTo))
      .where(eq(messages.id, messageId))
      .limit(1);

    return message ?? null;
  }

  async getMessageIdById(messageId: string) {
    const result = await this.getClient()
      .select({
        id: messages.id,
        chatId: messages.chatId,
      })
      .from(messages)
      .where(eq(messages.id, messageId))
      .limit(1);

    return result.length > 0 ? result[0] : null;
  }

  async getMessagesByChatId(
    chatId: string,
    limit: number,
    userId: string,
    cursor?: { id: string; createdAt: Date },
  ) {
    const client = this.getClient();

    const attachmentsAgg = client
      .select({
        messageId: messageAttachments.messageId,
        attachments: sql<Message['attachments']>`
        jsonb_agg(
          jsonb_build_object(
            'id', ${messageAttachments.id},
            'type', ${messageAttachments.type},
            'url', ${messageAttachments.url},
            'fileName', ${messageAttachments.fileName},
            'createdAt', ${messageAttachments.createdAt}
          )
        )
      `.as('attachments'),
      })
      .from(messageAttachments)
      .groupBy(messageAttachments.messageId)
      .as('attachments_agg');

    const statusesAgg = client
      .select({
        messageId: messageStatus.messageId,
        statuses: sql<Message['statuses']>`
        jsonb_agg(
          jsonb_build_object(
            'id', ${messageStatus.id},
            'userId', ${messageStatus.userId},
            'status', ${messageStatus.status}
          )
        )
      `.as('statuses'),
      })
      .from(messageStatus)
      .groupBy(messageStatus.messageId)
      .as('statuses_agg');

    const results = await client
      .select({
        id: messages.id,
        chatId: messages.chatId,
        text: messages.text,
        createdAt: messages.createdAt,
        sender: {
          id: users.id,
          username: users.username,
          imageURL: users.imageURL,
        },
        replyTo: sql<Message['replyTo'] | null>`
        CASE
          WHEN ${messages.replyTo} IS NOT NULL THEN
            jsonb_build_object(
              'id',       ${replyToMessage.id},
              'text',     ${replyToMessage.text},
              'senderId', ${replyToMessage.senderId}
            )
          ELSE NULL
        END
      `,
        attachments: sql<Message['attachments']>`
        COALESCE(${attachmentsAgg.attachments}, '[]'::jsonb)
      `,
        statuses: sql<Message['statuses']>`
        COALESCE(${statusesAgg.statuses}, '[]'::jsonb)
      `,
      })
      .from(messages)
      .innerJoin(users, eq(messages.senderId, users.id))
      .leftJoin(replyToMessage, eq(replyToMessage.id, messages.replyTo))
      .leftJoin(attachmentsAgg, eq(messages.id, attachmentsAgg.messageId))
      .leftJoin(statusesAgg, eq(messages.id, statusesAgg.messageId))
      .leftJoin(
        schema.messageDelete,
        and(
          eq(messages.id, schema.messageDelete.messageId),
          eq(schema.messageDelete.userId, userId),
        ),
      )
      .where(
        and(
          eq(messages.chatId, chatId),
          sql`${schema.messageDelete.id} IS NULL`,
          cursor
            ? or(
                lt(messages.createdAt, cursor.createdAt),
                and(
                  eq(messages.createdAt, cursor.createdAt),
                  lt(messages.id, cursor.id),
                ),
              )
            : undefined,
        ),
      )
      .orderBy(sql`${messages.createdAt} DESC, ${messages.id} DESC`)
      .limit(limit);

    return results;
  }
}
