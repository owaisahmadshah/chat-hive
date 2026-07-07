import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DRIZZLE_PROVIDER } from 'src/core/config/config';
import { DBClient } from 'src/core/database/database.service';
import * as schema from 'src/core/database/schema';
import { messageDelete } from 'src/core/database/schema/message';

@Injectable()
export class MessageDeleteRepository {
  constructor(
    @Inject(DRIZZLE_PROVIDER)
    private readonly mainDb: NodePgDatabase<typeof schema>,
  ) {}

  private getClient(tx?: DBClient): DBClient {
    return tx ?? this.mainDb;
  }

  async deleteMessage(messageId: string, userId: string, tx?: DBClient) {
    const results = await this.getClient(tx)
      .insert(messageDelete)
      .values({
        messageId,
        userId,
      })
      .returning({
        id: messageDelete.id,
        messageId: messageDelete.messageId,
        deletedAt: messageDelete.deletedAt,
      });

    return results.at(0);
  }
}
