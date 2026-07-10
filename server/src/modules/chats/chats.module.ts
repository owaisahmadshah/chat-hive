import { Module } from '@nestjs/common';
import { ChatsController } from './chats.controller';
import { ChatsService } from './chats.service';
import { ChatsRepository } from './repositories/chats.repository';
import { ChatMembersRepository } from './repositories/chat-members.repository';

@Module({
  controllers: [ChatsController],
  providers: [ChatsService, ChatsRepository, ChatMembersRepository],
  exports: [ChatsService],
})
export class ChatsModule {}
