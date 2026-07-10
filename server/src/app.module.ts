import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { IncomingMessage, ServerResponse } from 'http'; // FIX: Import native Node.js HTTP types
import env, { EnvConfig } from './core/config/env';
import { UsersModule } from './modules/users/users.module';
import { DatabaseModule } from './core/database/database.module';
import { RedisModule } from './core/redis/redis.module';
import { EmailModule } from './modules/email/email.module';
import { AuthModule } from './modules/auth/auth.module';
import { ChatsModule } from './modules/chats/chats.module';
import { MessagesModule } from './modules/messages/messages.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [env],
    }),
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService<EnvConfig, true>) => ({
        pinoHttp: {
          transport:
            configService.get('NODE_ENV') !== 'production'
              ? {
                  target: 'pino-pretty',
                  options: {
                    colorize: true,
                    levelFirst: true,
                    translateTime: 'yyyy-mm-dd HH:MM:ss.l o',
                    messageFormat: '{context}: {msg}',
                  },
                }
              : undefined,
          customSuccessMessage: (
            req: IncomingMessage,
            res: ServerResponse,
            responseTime: number,
          ) => {
            return `${req.method} ${req.url} ${res.statusCode} - ${responseTime} ms`;
          },
          customErrorMessage: (
            req: IncomingMessage,
            res: ServerResponse,
            error: Error,
          ) => {
            return `${req.method} ${req.url} ${res.statusCode} - ${error.message}`;
          },
          serializers: {
            req: (req: IncomingMessage) => ({
              method: req.method,
              url: req.url,
            }),
            res: (res: ServerResponse) => ({ statusCode: res.statusCode }),
          },
        },
      }),
      inject: [ConfigService],
    }),
    DatabaseModule,
    UsersModule,
    RedisModule,
    EmailModule,
    AuthModule,
    ChatsModule,
    MessagesModule,
  ],
  controllers: [],
})
export class AppModule {}
