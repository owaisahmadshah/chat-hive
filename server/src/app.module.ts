import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import env from './core/config/env';
import { UsersModule } from './modules/users/users.module';
import { DatabaseModule } from './core/database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [env],
    }),
    DatabaseModule,
    UsersModule,
  ],
})
export class AppModule {}
