import { Module } from '@nestjs/common';
import { UserController } from './users.controller';
import { UserRepository } from './repositories/users.repository';
import { UsersService } from './users.service';
import { SharedModule } from 'src/shared/shared.module';
import { UserSessionRepository } from './repositories/user-session.repository';

@Module({
  imports: [SharedModule],
  controllers: [UserController],
  providers: [UserRepository, UsersService, UserSessionRepository],
  exports: [UsersService],
})
export class UsersModule {}
