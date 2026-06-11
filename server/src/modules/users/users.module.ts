import { Module } from '@nestjs/common';
import { UserController } from './users.controller';
import { UserRepository } from './users.repository';
import { UsersService } from './users.service';

@Module({
  controllers: [UserController],
  providers: [UserRepository, UsersService],
})
export class UsersModule {}
