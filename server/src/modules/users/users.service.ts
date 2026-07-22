import { Injectable } from '@nestjs/common';
import { DatabaseService, DBClient } from 'src/core/database/database.service';
import { UserRepository } from './repositories/users.repository';
import {
  CreateUser,
  UserWithPassword,
  User,
  SessionSummary,
  CreateUserSession,
  decodeCursor,
  encodeCursor,
} from 'shared';
import { CryptoService } from 'src/shared/services/crypto.service';
import { userProjections } from './projections/users.projections';
import { assertConflict, assertExists } from 'src/shared/assertions';
import { UserSessionRepository } from './repositories/user-session.repository';
import { userSessionProjections } from './projections/user-session.projections';

@Injectable()
export class UsersService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly userRepository: UserRepository,
    private readonly cryptoService: CryptoService,
    private readonly userSessionRepository: UserSessionRepository,
  ) {}

  async createUser(data: CreateUser) {
    const emailExists = await this.userRepository.getUserByEmail(
      data.email,
      userProjections.summary,
    );

    assertConflict(!emailExists, 'Email already registered');

    const usernameExists = await this.userRepository.isUsernameExists(
      data.username,
    );

    assertConflict(!usernameExists, 'Username already taken');

    const hashedPassword = await this.cryptoService.hashPassword(data.password);

    const [savedUser] = await this.databaseService.transaction(async (tx) => {
      const createdUser = await this.userRepository.createUser(
        { ...data, password: hashedPassword },
        tx,
      );

      return [createdUser];
    });

    return savedUser;
  }

  async getUserWithPassword(identifier: string): Promise<UserWithPassword> {
    const user = await this.userRepository.getUserWithPassword(identifier);

    assertExists(user, 'User not found');
    return user;
  }

  async changePassword(userId: string, newPassword: string) {
    await this.databaseService.transaction(async (tx) => {
      await this.userRepository.updatePassword(userId, newPassword, tx);
    });
  }

  async getUser(userId: string): Promise<User> {
    const user = await this.userRepository.getUserById(
      userId,
      userProjections.user,
    );

    assertExists(user, 'User not found');
    return user;
  }

  async updateVerification(userId: string, value: boolean = true) {
    return await this.userRepository.updateVerified(userId, value);
  }

  async getUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository.getUserByEmail(
      email,
      userProjections.user,
    );

    assertExists(user, 'User not found');
    return user;
  }

  async updateProfileImageURL(userId: string, url: string) {
    return await this.userRepository.updateImageURL(userId, url);
  }

  async updateLastSeen(userId: string) {
    return await this.userRepository.updateLastSeen(userId);
  }

  async getSession(
    userId: string,
    deviceId: string,
  ): Promise<SessionSummary | null> {
    const session =
      await this.userSessionRepository.getSesssionByUserIdAndDeviceId(
        userId,
        deviceId,
      );

    return session;
  }

  async createSession(
    data: CreateUserSession,
    tx?: DBClient,
  ): Promise<SessionSummary> {
    const existingSession =
      await this.userSessionRepository.getSesssionByUserIdAndDeviceId(
        data.userId!,
        data.deviceId,
      );

    if (existingSession) {
      const updatedSession =
        await this.userSessionRepository.updateRefreshToken(
          existingSession.id,
          data.refreshToken as string,
          tx,
        );

      return updatedSession;
    }

    const session = await this.userSessionRepository.create(data, tx);

    return session;
  }

  async updateRefreshToken(sessionId: string, refreshToken: string) {
    const existingSession =
      await this.userSessionRepository.getSessionById(sessionId);

    assertExists(existingSession, 'Session not found');

    return await this.userSessionRepository.updateRefreshToken(
      sessionId,
      refreshToken,
    );
  }

  async deleteSession(sessionId: string) {
    const existingSession =
      await this.userSessionRepository.getSessionById(sessionId);

    assertExists(existingSession, 'Session not found');

    return await this.userSessionRepository.deleteSession(sessionId);
  }

  async deleteAllSessions(userId: string) {
    return await this.userSessionRepository.deleteAllSessions(userId);
  }

  async deleteAllSessionsExcept(userId: string, currentSessionId: string) {
    return this.userSessionRepository.deleteAllSessionsExcept(
      userId,
      currentSessionId,
    );
  }

  async getSessionByIdAndUserId(
    sessionId: string,
    userId: string,
  ): Promise<SessionSummary> {
    const session = await this.userSessionRepository.getSessionById(
      sessionId,
      userSessionProjections.summary,
    );

    assertExists(session, 'Session not found');
    assertExists(
      session.userId !== userId ? null : session,
      'Session not found',
    );

    return session;
  }

  async getUsers(query: string, limit: number, cursor: string | null) {
    const decodedCursor = cursor ? decodeCursor(cursor) : null;
    const users = await this.userRepository.getUsersByUsername(
      query,
      limit,
      decodedCursor?.username
        ? { userId: decodedCursor.id, username: decodedCursor?.username }
        : null,
    );

    const hasMore = users.length > limit;
    const data = hasMore ? users.slice(0, limit) : users;
    const nextCursor = hasMore
      ? encodeCursor({
          id: data.at(-1)!.id,
          username: data.at(-1)!.username,
        })
      : null;

    return { data, nextCursor, hasMore };
  }
}
