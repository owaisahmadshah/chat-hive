import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { EnvConfig } from 'src/core/config/env';
import { UsersModule } from '../users/users.module';
import { UserSessionModule } from '../user-session/user-session.module';
import { SharedModule } from 'src/shared/shared.module';
import { EmailModule } from '../email/email.module';
import { RedisModule } from 'src/core/redis/redis.module';

@Module({
  imports: [
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (config: ConfigService<EnvConfig, true>) => ({
        secret: config.get('JWT_SECRET'),
        signOptions: {
          expiresIn: config.get('ACCESS_TOKEN_EXPIRY'),
        },
      }),
    }),
    UsersModule,
    UserSessionModule,
    SharedModule,
    EmailModule,
    RedisModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
