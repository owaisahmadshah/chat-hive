import { Module } from '@nestjs/common';
import { ChatsController } from './chats.controller';
import { ChatsService } from './chats.service';
import { ChatsRepository } from './chats.repository';

@Module({
  controllers: [ChatsController],
  providers: [ChatsService, ChatsRepository],
})
export class ChatsModule {}
