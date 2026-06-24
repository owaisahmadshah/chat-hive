import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserSession, SessionSummary } from 'shared';
import { UserSessionRepository } from './user-session.repository';
import { DBClient } from 'src/core/database/database.service';
import { userSessionProjections } from './user-session.projections';
import { assertExists } from 'src/shared/assertions';

@Injectable()
export class UserSessionService {
  constructor(private readonly userSessionRepository: UserSessionRepository) {}

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
    if (session.userId !== userId) {
      throw new NotFoundException('Session not found');
    }

    return session;
  }
}
