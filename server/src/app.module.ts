import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import env from './config/env';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [env],
    }),
    UsersModule,
  ],
})
export class AppModule {}
