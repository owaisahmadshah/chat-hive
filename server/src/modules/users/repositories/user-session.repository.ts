import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DRIZZLE_PROVIDER } from 'src/core/config/config';
import { DBClient } from 'src/core/database/database.service';
import { CreateUserSession, SessionSummary } from 'shared';
import * as schema from 'src/core/database/schema';
import { userSessions } from 'src/core/database/schema';
import { userSessionProjections } from '../projections/user-session.projections';
import { and, eq, InferColumnsDataTypes, ne } from 'drizzle-orm';

@Injectable()
export class UserSessionRepository {
  constructor(
    @Inject(DRIZZLE_PROVIDER)
    private readonly mainDb: NodePgDatabase<typeof schema>,
  ) {}

  private getClient(tx?: DBClient): DBClient {
    return tx ?? this.mainDb;
  }

  async create(
    data: CreateUserSession,
    tx?: DBClient,
  ): Promise<SessionSummary> {
    const result = await this.getClient(tx)
      .insert(userSessions)
      .values(data)
      .returning(userSessionProjections.summary);

    return result[0] as SessionSummary;
  }

  async updateRefreshToken(
    sessionId: string,
    refreshToken: string,
    tx?: DBClient,
  ): Promise<SessionSummary> {
    const [session] = await this.getClient(tx)
      .update(userSessions)
      .set({
        refreshToken,
        lastActiveAt: new Date(),
      })
      .where(eq(userSessions.id, sessionId))
      .returning(userSessionProjections.summary);

    return session;
  }

  async deleteSession(sessionId: string, tx?: DBClient) {
    const result = await this.getClient(tx)
      .delete(userSessions)
      .where(eq(userSessions.id, sessionId))
      .returning();

    return result.length;
  }

  async deleteAllSessions(userId: string, tx?: DBClient) {
    const result = await this.getClient(tx)
      .delete(userSessions)
      .where(eq(userSessions.userId, userId))
      .returning();

    return result.length;
  }

  async deleteAllSessionsExcept(
    userId: string,
    sessionId: string,
    tx?: DBClient,
  ) {
    const result = await this.getClient(tx)
      .delete(userSessions)
      .where(
        and(eq(userSessions.userId, userId), ne(userSessions.id, sessionId)),
      )
      .returning();

    return result.length;
  }

  async getSessionById<
    T extends Record<string, any> = typeof userSessionProjections.summary,
  >(
    sessionId: string,
    projection: T = userSessionProjections.summary as unknown as T,
    tx?: DBClient,
  ): Promise<InferColumnsDataTypes<T> | null> {
    const [result] = (await this.getClient(tx)
      .select(projection)
      .from(userSessions)
      .where(eq(userSessions.id, sessionId))) as T[];

    return result ?? null;
  }

  async getSessionByUserId<
    T extends Record<string, any> = typeof userSessionProjections.summary,
  >(
    userId: string,
    projection: T = userSessionProjections.summary as unknown as T,
    tx?: DBClient,
  ): Promise<InferColumnsDataTypes<T> | null> {
    const result = (await this.getClient(tx)
      .select(projection)
      .from(userSessions)
      .where(eq(userSessions.userId, userId))) as T[];

    return result[0] ?? null;
  }

  async getSesssionByUserIdAndDeviceId<
    T extends Record<string, any> = typeof userSessionProjections.summary,
  >(
    userId: string,
    deviceId: string,
    projection: T = userSessionProjections.summary as unknown as T,
    tx?: DBClient,
  ): Promise<InferColumnsDataTypes<T> | null> {
    const result = (await this.getClient(tx)
      .select(projection)
      .from(userSessions)
      .where(
        and(
          eq(userSessions.userId, userId),
          eq(userSessions.deviceId, deviceId),
        ),
      )) as T[];

    return result[0] ?? null;
  }
}
