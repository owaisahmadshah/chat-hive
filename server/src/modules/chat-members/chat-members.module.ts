import { Module } from '@nestjs/common';
import { ChatMembersController } from './chat-members.controller';
import { ChatMembersService } from './chat-members.service';
import { ChatMembersRepository } from './chat-members.repository';

@Module({
  controllers: [ChatMembersController],
  providers: [ChatMembersService, ChatMembersRepository],
  exports: [ChatMembersService],
})
export class ChatMembersModule {}
