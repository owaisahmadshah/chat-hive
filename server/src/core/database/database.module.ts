import { Module, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { DRIZZLE_PROVIDER } from '../config/config';
import * as schema from './schema';
import { EnvConfig } from '../config/env';
import { DatabaseService } from './database.service';
import { ChatQueryBuilder } from './query-builders/chat-query-builder';

@Global()
@Module({
  providers: [
    {
      provide: DRIZZLE_PROVIDER,
      inject: [ConfigService],
      useFactory: (configService: ConfigService<EnvConfig, true>) => {
        const connectionString = configService.get('DATABASE_URL', {
          infer: true,
        });
        const nodeEnv = configService.get('NODE_ENV', { infer: true });

        const pool = new Pool({
          connectionString,
          ssl: nodeEnv === 'production' ? { rejectUnauthorized: false } : false,
          max: 10,
          idleTimeoutMillis: 30000,
          connectionTimeoutMillis: 10000,
        });

        pool.on('error', (err) => {
          console.error('Unexpected DB pool error', err);
        });

        return drizzle({ client: pool, schema, casing: 'snake_case' });
      },
    },
    DatabaseService,
  ],
  exports: [DRIZZLE_PROVIDER, DatabaseService, ChatQueryBuilder],
})
export class DatabaseModule {}
