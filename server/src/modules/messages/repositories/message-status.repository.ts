import { Inject, Injectable } from '@nestjs/common';
import { and, eq, sql } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { MessageStatus, MessageStatusEnum } from 'shared';
import { DRIZZLE_PROVIDER } from 'src/core/config/config';
import { DBClient } from 'src/core/database/database.service';
import * as schema from 'src/core/database/schema';
import { messageStatus } from 'src/core/database/schema';

@Injectable()
export class MessageStatusRepository {
  constructor(
    @Inject(DRIZZLE_PROVIDER)
    private readonly mainDb: NodePgDatabase<typeof schema>,
  ) {}

  private getClient(tx?: DBClient): DBClient {
    return tx ?? this.mainDb;
  }

  async createManyStatus(data: MessageStatus[], tx?: DBClient) {
    const results = await this.getClient(tx)
      .insert(messageStatus)
      .values(data)
      .returning({
        id: messageStatus.id,
        userId: messageStatus.userId,
        status: messageStatus.status,
        createdAt: messageStatus.createdAt,
      });

    return results;
  }

  async updateStatusByMessageId(
    messageId: string,
    userId: string,
    status: MessageStatusEnum,
    tx?: DBClient,
  ) {
    const updatedStatus = await this.getClient(tx)
      .update(messageStatus)
      .set({ status })
      .where(
        and(
          eq(messageStatus.messageId, messageId),
          eq(messageStatus.userId, userId),
        ),
      )
      .returning({
        status: messageStatus.status,
        userId: messageStatus.userId,
        messageId: messageStatus.messageId,
      });

    return updatedStatus.at(0);
  }

  async updateMessagesStatusByChatId(
    chatId: string,
    userId: string,
    status: 'sent' | 'delivered' | 'read',
    tx?: DBClient,
  ) {
    // TODO: For optimization ignore all the deleted messages
    const updatedRows = await this.getClient(tx)
      .update(messageStatus)
      .set({ status, updatedAt: new Date() })
      .where(
        and(
          eq(messageStatus.userId, userId),
          sql`${messageStatus.status} != ${status}`,
          sql`${messageStatus.messageId} IN (
          SELECT id FROM messages WHERE chat_id = ${chatId}
        )`,
        ),
      )
      .returning({
        messageId: messageStatus.messageId,
      });

    return updatedRows;
  }
}
