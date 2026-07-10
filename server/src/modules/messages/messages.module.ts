import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { MessagesRepository } from './repositories/messages.repository';
import { MessageAttachmentRepository } from './repositories/message-attachment.repository';
import { MessageDeleteRepository } from './repositories/message-delete.repository';
import { MessageStatusRepository } from './repositories/message-status.repository';
import { ChatsModule } from '../chats/chats.module';

@Module({
  imports: [ChatsModule],
  controllers: [MessagesController],
  providers: [
    MessagesService,
    MessagesRepository,
    MessageAttachmentRepository,
    MessageDeleteRepository,
    MessageStatusRepository,
  ],
})
export class MessagesModule {}
