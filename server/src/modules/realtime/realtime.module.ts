import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ChatGateway } from './gateways/chat.gateway';
import { WsAuthGuard } from './guards/ws-auth.guard';
import { PresenceGateway } from './gateways/presence.gateway';
import { ChatsModule } from '../chats/chats.module';
import { MessagesModule } from '../messages/messages.module';

@Module({
  imports: [JwtModule, ChatsModule, MessagesModule],
  providers: [ChatGateway, PresenceGateway, WsAuthGuard],
  exports: [ChatGateway],
})
export class RealtimeModule {}
