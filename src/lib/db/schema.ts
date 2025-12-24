import { pgTable, text, timestamp, uuid, boolean, json } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  name: text('name'),
  picture: text('picture'),
  emailVerified: boolean('email_verified').default(false),
  about: text('about'),
  phone: text('phone'),
  location: text('location'),
  website: text('website'),
  twitter: text('twitter'),
  linkedin: text('linkedin'),
  facebook: text('facebook'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const sessions = pgTable('sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  token: text('token').notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const subscribers = pgTable('subscribers', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  gmail: text('gmail'),
  firstName: text('first_name'),
  lastName: text('last_name'),
  status: text('status').default('active'), // active, unsubscribed, bounced
  source: text('source'), // where they subscribed from
  subscribedAt: timestamp('subscribed_at').defaultNow(),
  unsubscribedAt: timestamp('unsubscribed_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export type Subscriber = typeof subscribers.$inferSelect;
export type NewSubscriber = typeof subscribers.$inferInsert;
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;
export const emails = pgTable('emails', {
  id: uuid('id').primaryKey().defaultRandom(),
  subject: text('subject').notNull(),
  content: text('content').notNull(),
  audience: text('audience').notNull().default('all'),
  status: text('status').notNull().default('draft'), // draft, sent
  sentAt: timestamp('sent_at'),
  stats: json('stats'), // { sent: number, failed: number, open: number, click: number }
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export type Email = typeof emails.$inferSelect;
export type NewEmail = typeof emails.$inferInsert;
