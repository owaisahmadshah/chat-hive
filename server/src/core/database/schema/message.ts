import { pgEnum, pgTable as table } from 'drizzle-orm/pg-core';
import * as t from 'drizzle-orm/pg-core';
import { chats } from './chat';
import { users } from './user';
import { AnyPgColumn } from 'drizzle-orm/pg-core';

export const messages = table(
  'messages',
  {
    id: t.uuid().primaryKey().defaultRandom(),
    chatId: t
      .uuid()
      .notNull()
      .references(() => chats.id, { onDelete: 'cascade' }),
    senderId: t
      .uuid()
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    text: t.varchar(),
    replyTo: t
      .uuid()
      .references((): AnyPgColumn => messages.id, { onDelete: 'set null' }),
    createdAt: t.timestamp().notNull().defaultNow(),
    updatedAt: t.timestamp(),
  },
  (table) => [
    t.index('message_chat_id_idx').on(table.chatId),
    t
      .index('message_sender_id_and_chat_id_idx')
      .on(table.senderId, table.chatId),
  ],
);

export const messageAttachmentTypeEnum = pgEnum('type', [
  'image',
  'video',
  'file',
  'audio',
]);

export const messageAttachments = table(
  'message_attachments',
  {
    id: t.uuid().primaryKey().defaultRandom(),
    messageId: t.uuid().references(() => messages.id, { onDelete: 'cascade' }),
    type: messageAttachmentTypeEnum().notNull(),
    url: t.varchar().notNull(),
    fileName: t.varchar(),
    publicId: t.varchar().notNull(),
    createdAt: t.timestamp().defaultNow(),
  },
  (table) => [
    t.index('attachment_message_id_idx').on(table.messageId),
    t.index('attachment_public_id_idx').on(table.publicId),
  ],
);

export const messageStatusEnum = pgEnum('status', [
  'sent',
  'delivered',
  'read',
]);

export const messageStatus = table(
  'message_status',
  {
    id: t.uuid().primaryKey().defaultRandom(),
    messageId: t.uuid().references(() => messages.id, { onDelete: 'cascade' }),
    userId: t.uuid().references(() => users.id, { onDelete: 'cascade' }),
    status: messageStatusEnum().notNull().default('sent'),
    createdAt: t.timestamp().notNull().defaultNow(),
    updatedAt: t.timestamp(),
  },
  (table) => [
    t.index('status_message_id_idx').on(table.messageId),
    t
      .uniqueIndex('status_message_id_and_user_id_unique')
      .on(table.messageId, table.userId),
  ],
);

export const messageDelete = table(
  'message_deletes',
  {
    id: t.uuid().primaryKey().defaultRandom(),
    messageId: t.uuid().references(() => messages.id, { onDelete: 'cascade' }),
    userId: t.uuid().references(() => users.id, { onDelete: 'cascade' }),
    deletedAt: t.timestamp().notNull().defaultNow(),
  },
  (table) => [
    t.index('delete_message_id_idx').on(table.messageId),
    t
      .uniqueIndex('delete_message_id_and_user_id_unique')
      .on(table.messageId, table.userId),
  ],
);
