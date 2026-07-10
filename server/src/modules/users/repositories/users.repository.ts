import { Injectable, Inject } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { and, asc, eq, gt, ilike, or } from 'drizzle-orm';
import { InferColumnsDataTypes } from 'drizzle-orm';
import * as schema from '../../../core/database/schema';

import { users } from '../../../core/database/schema';
import { DRIZZLE_PROVIDER } from 'src/core/config/config';
import { AuthProvider, CreateUser, User, UserSummary } from 'shared';
import { DBClient } from 'src/core/database/database.service';
import { userProjections } from '../projections/users.projections';

@Injectable()
export class UserRepository {
  constructor(
    @Inject(DRIZZLE_PROVIDER)
    private readonly mainDb: NodePgDatabase<typeof schema>,
  ) {}

  private getClient(tx?: DBClient): DBClient {
    return tx ?? this.mainDb;
  }

  async createUser(data: CreateUser, tx?: DBClient): Promise<UserSummary> {
    const [user] = await this.getClient(tx)
      .insert(users)
      .values(data)
      .returning(userProjections.summary);

    return user;
  }

  async isUsernameExists(username: string, tx?: DBClient): Promise<boolean> {
    const result = await this.getClient(tx)
      .select({ id: users.id })
      .from(users)
      .where(eq(users.username, username))
      .limit(1);

    return result.length > 0;
  }

  async updateImageURL(
    userId: string,
    imageURL: string,
    tx?: DBClient,
  ): Promise<User> {
    const result = await this.getClient(tx)
      .update(users)
      .set({ imageURL })
      .where(eq(users.id, userId))
      .returning(userProjections.user);

    return result[0];
  }

  async updatePassword(userId: string, password: string, tx?: DBClient) {
    const [user] = await this.getClient(tx)
      .update(users)
      .set({ password })
      .where(eq(users.id, userId))
      .returning(userProjections.user);

    return user;
  }

  async updateVerified(
    userId: string,
    verified: boolean,
    tx?: DBClient,
  ): Promise<User> {
    const [user] = await this.getClient(tx)
      .update(users)
      .set({ verified })
      .where(eq(users.id, userId))
      .returning(userProjections.user);

    return user;
  }

  async updateAuthProvider(
    userId: string,
    authProvider: AuthProvider,
    authProviderId: string | null,
    tx?: DBClient,
  ): Promise<User> {
    const data: {
      authProvider: AuthProvider;
      authProviderId: string | null;
      password?: null;
    } = {
      authProvider,
      authProviderId,
      ...(authProvider === 'google' && { password: null }),
    };

    const [user] = await this.getClient(tx)
      .update(users)
      .set(data)
      .where(eq(users.id, userId))
      .returning(userProjections.user);

    return user;
  }

  async updateLastSeen(userId: string, tx?: DBClient) {
    const [user] = await this.getClient(tx)
      .update(users)
      .set({ lastSeen: new Date() })
      .where(eq(users.id, userId))
      .returning(userProjections.user);

    return user;
  }

  async deleteUser(userId: string, tx?: DBClient) {
    await this.getClient(tx).delete(users).where(eq(users.id, userId));
  }

  async getUserById<
    T extends Record<string, any> = typeof userProjections.user,
  >(
    userId: string,
    projection: T = userProjections.user as unknown as T,
    tx?: DBClient,
  ): Promise<InferColumnsDataTypes<T> | null> {
    const result = (await this.getClient(tx)
      .select(projection)
      .from(users)
      .where(eq(users.id, userId))
      .limit(1)) as T[];

    return result[0] ?? null;
  }

  async getUserByEmail<
    T extends Record<string, any> = typeof userProjections.user,
  >(
    email: string,
    projection: T = userProjections.user as unknown as T,
    tx?: DBClient,
  ): Promise<InferColumnsDataTypes<T> | null> {
    const result = (await this.getClient(tx)
      .select(projection)
      .from(users)
      .where(eq(users.email, email))
      .limit(1)) as T[];

    return result[0] ?? null;
  }

  async getUserByUsername<
    T extends Record<string, any> = typeof userProjections.user,
  >(
    username: string,
    projection: T = userProjections.user as unknown as T,
    tx?: DBClient,
  ): Promise<InferColumnsDataTypes<T> | null> {
    const result = await this.getClient(tx)
      .select(projection)
      .from(users)
      .where(eq(users.username, username))
      .limit(1);

    return (result[0] as T) ?? null;
  }

  async getUserWithPasswordByUserId<
    T extends Record<string, any> = typeof userProjections.userWithPass,
  >(
    identifier: string,
    projection: T = userProjections.userWithPass as unknown as T,
    tx?: DBClient,
  ): Promise<InferColumnsDataTypes<T> | null> {
    const result = await this.getClient(tx)
      .select(projection)
      .from(users)
      .where(eq(users.id, identifier))
      .limit(1);

    return (result[0] as T) ?? null;
  }

  async getUserWithPassword<
    T extends Record<string, any> = typeof userProjections.userWithPass,
  >(
    identifier: string,
    projection: T = userProjections.userWithPass as unknown as T,
    tx?: DBClient,
  ): Promise<InferColumnsDataTypes<T> | null> {
    const result = await this.getClient(tx)
      .select(projection)
      .from(users)
      .where(or(eq(users.username, identifier), eq(users.email, identifier)))
      .limit(1);

    return (result[0] as T) ?? null;
  }

  async getUsersByUsername(
    username: string,
    limit: number,
    cursor: { userId: string; username: string },
    tx?: DBClient,
  ): Promise<UserSummary[]> {
    const query = this.getClient(tx)
      .select(userProjections.summary)
      .from(users)
      .where(
        and(
          // search filter always applies
          ilike(users.username, `%${username}%`),
          // cursor condition only applies if cursor exists
          cursor
            ? or(
                gt(users.username, cursor.username),
                and(
                  eq(users.username, cursor.username),
                  gt(users.id, cursor.userId),
                ),
              )
            : undefined,
        ),
      )
      .orderBy(asc(users.username), asc(users.id))
      .limit(limit + 1);

    const result = await query;

    return result;
  }
}
