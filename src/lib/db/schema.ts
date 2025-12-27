import { pgTable, text, timestamp, uuid, boolean, json, bigint, pgEnum } from 'drizzle-orm/pg-core';

// Enums for post and comment status
export const postTypeEnum = pgEnum('post_type', ['post', 'page']);
export const statusEnum = pgEnum('status', ['published', 'draft', 'archived']);
export const commentStatusEnum = pgEnum('comment_status', ['pending', 'approved', 'spam']);

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  name: text('name'),
  picture: text('picture'),
  emailVerified: boolean('email_verified').default(false),
  admin: boolean('admin').default(false), // Simple admin flag
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

export const posts = pgTable('posts', {
  id: bigint('id', { mode: 'number' }).primaryKey().generatedByDefaultAsIdentity(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  content: text('content'),
  excerpt: text('excerpt'),
  thumbnailUrl: text('thumbnail_url'),
  postType: postTypeEnum('post_type').default('post'),
  status: statusEnum('status').default('draft'),
  viewsCount: bigint('views_count', { mode: 'number' }).default(0),
  likesCount: bigint('likes_count', { mode: 'number' }).default(0),
  publishedAt: timestamp('published_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const comments = pgTable('comments', {
  id: bigint('id', { mode: 'number' }).primaryKey().generatedByDefaultAsIdentity(),
  postId: bigint('post_id', { mode: 'number' }).notNull().references(() => posts.id, { onDelete: 'cascade' }),
  guestName: text('guest_name'),
  guestEmail: text('guest_email'),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
  body: text('body').notNull(),
  status: commentStatusEnum('comment_status').default('pending'),
  parentId: bigint('parent_id', { mode: 'number' }).references(() => comments.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow(),
});

export const postAnalytics = pgTable('post_analytics', {
  id: bigint('id', { mode: 'number' }).primaryKey().generatedByDefaultAsIdentity(),
  postId: bigint('post_id', { mode: 'number' }).notNull().references(() => posts.id, { onDelete: 'cascade' }),
  visitDate: timestamp('visit_date', { mode: 'date' }).notNull(),
  dailyVisits: bigint('daily_visits', { mode: 'number' }).default(0),
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

// Type exports
export type Subscriber = typeof subscribers.$inferSelect;
export type NewSubscriber = typeof subscribers.$inferInsert;
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
export type Comment = typeof comments.$inferSelect;
export type NewComment = typeof comments.$inferInsert;
export type PostAnalytics = typeof postAnalytics.$inferSelect;
export type NewPostAnalytics = typeof postAnalytics.$inferInsert;
export type Email = typeof emails.$inferSelect;
export type NewEmail = typeof emails.$inferInsert;
