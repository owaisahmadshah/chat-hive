import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { MessagesRepository } from './repositories/messages.repository';
import { ChatMembersModule } from '../chat-members/chat-members.module';
import { MessageAttachmentRepository } from './repositories/message-attachment.repository';
import { MessageDeleteRepository } from './repositories/message-delete.repository';
import { MessageStatusRepository } from './repositories/message-status.repository';

@Module({
  imports: [ChatMembersModule],
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
