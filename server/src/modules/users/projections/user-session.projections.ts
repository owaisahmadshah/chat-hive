import { userSessions } from 'src/core/database/schema';

export const userSessionProjections = {
  summary: {
    id: userSessions.id,
    userId: userSessions.userId,
    deviceId: userSessions.deviceId,
    refreshToken: userSessions.refreshToken,
    createdAt: userSessions.createdAt,
  },
  session: {
    id: userSessions.id,
    userId: userSessions.userId,
    deviceId: userSessions.deviceId,
    deviceName: userSessions.deviceName,
    platform: userSessions.platform,
    refreshToken: userSessions.refreshToken,
    createdAt: userSessions.createdAt,
  },
};
