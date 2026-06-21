import { Module } from '@nestjs/common';
import { UserController } from './users.controller';
import { UserRepository } from './users.repository';
import { UsersService } from './users.service';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [SharedModule],
  controllers: [UserController],
  providers: [UserRepository, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
