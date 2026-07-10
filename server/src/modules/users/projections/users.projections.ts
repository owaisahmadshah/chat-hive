import { users } from 'src/core/database/schema';

export const userProjections = {
  summary: {
    id: users.id,
    username: users.username,
    imageURL: users.imageURL,
    lastSeen: users.lastSeen,
    createdAt: users.createdAt,
  },

  user: {
    id: users.id,
    username: users.username,
    email: users.email,
    imageURL: users.imageURL,
    lastSeen: users.lastSeen,
    authProvider: users.authProvider,
    authProviderId: users.authProviderId,
    createdAt: users.createdAt,
  },

  userWithPass: {
    id: users.id,
    username: users.username,
    email: users.email,
    verified: users.verified,
    password: users.password,
    authProvider: users.authProvider,
    authProviderId: users.authProviderId,
  },
} as const;
