import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ChatGateway } from './gateways/chat.gateway';
import { WsAuthGuard } from './guards/ws-auth.guard';
import { PresenceGateway } from './gateways/presence.gateway';

@Module({
  imports: [JwtModule],
  providers: [ChatGateway, PresenceGateway, WsAuthGuard],
  exports: [ChatGateway],
})
export class RealtimeModule {}
