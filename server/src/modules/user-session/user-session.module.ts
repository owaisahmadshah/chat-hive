import { Module } from '@nestjs/common';
import { UserSessionService } from './user-session.service';
import { UserSessionController } from './user-session.controller';
import { UserSessionRepository } from './user-session.repository';

@Module({
  providers: [UserSessionService, UserSessionRepository],
  controllers: [UserSessionController],
  exports: [UserSessionService],
})
export class UserSessionModule {}
