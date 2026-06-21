import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { PgTransaction } from 'drizzle-orm/pg-core';
import { DRIZZLE_PROVIDER } from '../config/config';
import * as schema from './schema';

export type DBClient =
  | NodePgDatabase<typeof schema>
  | PgTransaction<any, typeof schema, any>;

@Injectable()
export class DatabaseService {
  constructor(
    @Inject(DRIZZLE_PROVIDER)
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async transaction<T>(callback: (tx: DBClient) => Promise<T>): Promise<T> {
    return this.db.transaction(callback);
  }
}
