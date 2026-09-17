import { forwardRef, Module } from '@nestjs/common';
import { ChatsController } from './chats.controller';
import { ChatsService } from './chats.service';
import { ChatsRepository } from './repositories/chats.repository';
import { ChatMembersRepository } from './repositories/chat-members.repository';
import { MessagesModule } from '../messages/messages.module';

@Module({
  imports: [forwardRef(() => MessagesModule)],
  controllers: [ChatsController],
  providers: [ChatsService, ChatsRepository, ChatMembersRepository],
  exports: [ChatsService],
})
export class ChatsModule {}
