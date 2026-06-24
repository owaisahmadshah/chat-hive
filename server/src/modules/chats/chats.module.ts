import { Module } from '@nestjs/common';
import { ChatsController } from './chats.controller';
import { ChatsService } from './chats.service';
import { ChatsRepository } from './chats.repository';
import { ChatQueryBuilder } from 'src/core/database/query-builders/chat-query-builder';

@Module({
  controllers: [ChatsController],
  providers: [ChatsService, ChatsRepository, ChatQueryBuilder],
})
export class ChatsModule {}
