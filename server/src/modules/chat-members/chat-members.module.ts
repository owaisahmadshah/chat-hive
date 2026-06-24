import { Module } from '@nestjs/common';
import { ChatMembersController } from './chat-members.controller';
import { ChatMembersService } from './chat-members.service';
import { ChatsRepository } from '../chats/chats.repository';

@Module({
  controllers: [ChatMembersController],
  providers: [ChatMembersService, ChatsRepository],
  exports: [ChatMembersService],
})
export class ChatMembersModule {}
