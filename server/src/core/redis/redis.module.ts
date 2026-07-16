import { Module, Global, OnApplicationShutdown, Inject } from '@nestjs/common';
import { Redis } from 'ioredis';
import {
  REDIS_PROVIDER,
  REDIS_PUB_PROVIDER,
  REDIS_SUB_PROVIDER,
} from '../config/config';
import { EnvConfig } from '../config/env';
import { ConfigService } from '@nestjs/config';
import { RedisService } from './redis.service';
import { PresenceRepository } from './repositories/presence.repository';

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
    {
      provide: REDIS_PUB_PROVIDER,
      inject: [REDIS_PROVIDER],
      useFactory: (redisClient: Redis) => redisClient, // Reuse main client for pub
    },
    {
      provide: REDIS_SUB_PROVIDER,
      inject: [REDIS_PROVIDER],
      useFactory: (redisClient: Redis) => redisClient.duplicate(), // Duplicate only for sub
    },
    RedisService,
    PresenceRepository,
  ],
  exports: [
    REDIS_PROVIDER,
    REDIS_PUB_PROVIDER,
    REDIS_SUB_PROVIDER,
    RedisService,
    PresenceRepository,
  ],
})
export class RedisModule implements OnApplicationShutdown {
  constructor(
    @Inject(REDIS_PROVIDER) private readonly redis: Redis,
    @Inject(REDIS_SUB_PROVIDER) private readonly redisSub: Redis,
  ) {}

  async onApplicationShutdown() {
    await Promise.all([this.redis.quit(), this.redisSub.quit()]);
  }
}
