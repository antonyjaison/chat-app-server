import { integer, pgTable, serial, text, timestamp, uuid, primaryKey, boolean } from 'drizzle-orm/pg-core';

// Users table definition
export const usersTable = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password_hash: text('password_hash').notNull(),
  online_status: boolean('online_status').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().$onUpdate(() => new Date()),
});

// Threads (conversations) table definition
export const threadsTable = pgTable('threads', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().$onUpdate(() => new Date()),
});

// User-Thread association table (Many-to-Many relationship)
export const userThreadsTable = pgTable('user_threads', {
    id: serial('id').primaryKey(), // Auto-incrementing primary key
    userId: integer('user_id')
      .notNull()
      .references(() => usersTable.id, { onDelete: 'cascade' }),
    threadId: uuid('thread_id')
      .notNull()
      .references(() => threadsTable.id, { onDelete: 'cascade' }),
    lastReadMessageId: integer('last_read_message_id')
      .references(() => messagesTable.id, { onDelete: 'set null' }),
  });

// Messages table definition
export const messagesTable = pgTable('messages', {
  id: serial('id').primaryKey(),
  threadId: uuid('thread_id')
    .notNull()
    .references(() => threadsTable.id, { onDelete: 'cascade' }),
  senderId: integer('sender_id')
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  messageType: text('message_type').notNull().default('text'),
  readStatus: integer('read_status').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// File Uploads table definition
export const fileUploadsTable = pgTable('file_uploads', {
  id: serial('id').primaryKey(),
  messageId: integer('message_id')
    .notNull()
    .references(() => messagesTable.id, { onDelete: 'cascade' }),
  fileUrl: text('file_url').notNull(),
  fileType: text('file_type').notNull(), // image, video, etc.
  fileSize: integer('file_size').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Type inference for inserting and selecting
export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;

export type InsertThread = typeof threadsTable.$inferInsert;
export type SelectThread = typeof threadsTable.$inferSelect;

export type InsertUserThread = typeof userThreadsTable.$inferInsert;
export type SelectUserThread = typeof userThreadsTable.$inferSelect;

export type InsertMessage = typeof messagesTable.$inferInsert;
export type SelectMessage = typeof messagesTable.$inferSelect;

export type InsertFileUpload = typeof fileUploadsTable.$inferInsert;
export type SelectFileUpload = typeof fileUploadsTable.$inferSelect;
