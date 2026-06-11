import { pgEnum, pgTable as table } from 'drizzle-orm/pg-core';
import * as t from 'drizzle-orm/pg-core';
import { users } from './user';

export const chatUserRoleEnum = pgEnum('role', ['admin', 'member']);

export const chats = table(
  'chats',
  {
    id: t.uuid().primaryKey().defaultRandom(),
    createdBy: t.uuid().references(() => users.id, { onDelete: 'cascade' }),
    name: t.varchar(),
    logoURL: t.varchar(),
    isGroup: t.boolean().notNull().default(false),
    createdAt: t.timestamp().notNull().defaultNow(),
    updatedAt: t.timestamp(),
  },
  (table) => [t.index('created_by_idx').on(table.createdBy)],
);

export const chatMembers = table(
  'chat_members',
  {
    id: t.uuid().primaryKey().defaultRandom(),
    chatId: t.uuid().references(() => chats.id, { onDelete: 'cascade' }),
    userId: t.uuid().references(() => users.id, { onDelete: 'cascade' }),
    role: chatUserRoleEnum().notNull().default('member'),
    joinedAt: t.timestamp().notNull().defaultNow(),
    deletedAt: t.timestamp(),
  },
  (table) => [
    t.index('chat_id_idx').on(table.chatId),
    t.index('chat_id_and_user_id_idx').on(table.chatId, table.userId),
  ],
);
