import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { MessageAttachment } from 'shared';
import { DRIZZLE_PROVIDER } from 'src/core/config/config';
import { DBClient } from 'src/core/database/database.service';
import * as schema from 'src/core/database/schema';
import { messageAttachments } from 'src/core/database/schema/message';

@Injectable()
export class MessageAttachmentRepository {
  constructor(
    @Inject(DRIZZLE_PROVIDER)
    private readonly mainDb: NodePgDatabase<typeof schema>,
  ) {}

  private getClient(tx?: DBClient): DBClient {
    return tx ?? this.mainDb;
  }

  async createAttachment(data: MessageAttachment, tx?: DBClient) {
    const [attachment] = await this.getClient(tx)
      .insert(messageAttachments)
      .values(data)
      .returning();

    return attachment;
  }

  async createAttachments(data: MessageAttachment[], tx?: DBClient) {
    const attachments = await this.getClient(tx)
      .insert(messageAttachments)
      .values(data)
      .returning({
        id: messageAttachments.id,
        type: messageAttachments.type,
        url: messageAttachments.url,
        fileName: messageAttachments.fileName,
        createdAt: messageAttachments.createdAt,
      });

    return attachments;
  }
}
