import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { alias } from 'drizzle-orm/pg-core';
import { eq, sql } from 'drizzle-orm';
import { CreateMessage, ReplyToMessageRecord } from 'shared';
import { DRIZZLE_PROVIDER } from 'src/core/config/config';
import { DBClient } from 'src/core/database/database.service';
import * as schema from 'src/core/database/schema';
import { messages } from 'src/core/database/schema/message';
import { users } from 'src/core/database/schema';

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
}
