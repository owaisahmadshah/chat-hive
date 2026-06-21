import { pgEnum, pgTable as table } from 'drizzle-orm/pg-core';
import * as t from 'drizzle-orm/pg-core';

export const authProviderEnum = pgEnum('authProvider', ['local', 'google']);
export const sessionPlatormEnum = pgEnum('platform', [
  'web',
  'android',
  'ios',
  'desktop',
]);

export const users = table(
  'users',
  {
    id: t.uuid().primaryKey().defaultRandom(),
    username: t.varchar().unique().notNull(),
    email: t.varchar().unique().notNull(),
    imageURL: t.varchar(),
    authProvider: authProviderEnum().notNull().default('local'),
    authProviderId: t.varchar(),
    password: t.varchar(),
    verified: t.boolean().notNull().default(false),
    lastSeen: t.timestamp(),
    createdAt: t.timestamp().notNull().defaultNow(),
  },
  (table) => [t.index('users_username_trgm_idx').using('gin', table.username)],
);

export const userSessions = table(
  'user_sessions',
  {
    id: t.uuid().primaryKey().defaultRandom(),
    userId: t.uuid().references(() => users.id, { onDelete: 'cascade' }),
    deviceId: t.varchar().notNull(),
    deviceName: t.varchar(),
    platform: sessionPlatormEnum().notNull(),
    refreshToken: t.varchar(),
    lastActiveAt: t.timestamp(),
    createdAt: t.timestamp().defaultNow(),
  },
  (table) => [
    t.index('session_user_id_idx').on(table.userId),
    t.index('session_refresh_token_idx').on(table.refreshToken),
    t
      .uniqueIndex('user_device_platform_idx')
      .on(table.userId, table.deviceId, table.platform),
  ],
);
