import { Module, Global } from '@nestjs/common';
import { Redis } from 'ioredis';
import { REDIS_PROVIDER } from '../config/config';
import { EnvConfig } from '../config/env';
import { ConfigService } from '@nestjs/config';
import { RedisService } from './redis.service';

@Global()
@Module({
  providers: [
    {
      provide: REDIS_PROVIDER,
      inject: [ConfigService],
      useFactory: (configService: ConfigService<EnvConfig, true>) => {
        return new Redis({
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT'),
          maxRetriesPerRequest: null,
        });
      },
    },
    RedisService,
  ],
  exports: [RedisService],
})
export class RedisModule {}
