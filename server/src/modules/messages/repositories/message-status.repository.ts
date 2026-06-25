import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { MessageStatus } from 'shared';
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
}
