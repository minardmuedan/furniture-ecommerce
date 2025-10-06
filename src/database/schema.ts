import { relations } from 'drizzle-orm'
import { boolean, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core'

export const usersTable = pgTable('users', {
  id: varchar().primaryKey(),
  username: varchar().notNull(),
  email: varchar().unique().notNull(),
  emailVerified: timestamp('email_verified'),
  password: varchar().notNull(),
  avatarSrc: varchar('avatar_src'),
  isAdmin: boolean('is_admin'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const sessionsTable = pgTable('sessions', {
  id: varchar().primaryKey(),
  userId: varchar()
    .notNull()
    .references(() => usersTable.id),
  ipAddress: varchar('ip_address'),
  userAgent: varchar('user_agent'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  expiresAt: timestamp('expires_at').notNull(),
})

export const sessionRelations = relations(sessionsTable, ({ one }) => ({
  user: one(usersTable, { fields: [sessionsTable.userId], references: [usersTable.id] }),
}))

export const emailVerificationsTable = pgTable('email-verifications', {
  id: varchar().primaryKey(),
  userId: varchar('user_id')
    .notNull()
    .references(() => usersTable.id),
  token: varchar().unique().notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const emailVerificationRelations = relations(emailVerificationsTable, ({ one }) => ({
  user: one(usersTable, { fields: [emailVerificationsTable.userId], references: [usersTable.id] }),
}))

export const passwordVerificationsTable = pgTable('password-verifications', {
  id: varchar().primaryKey(),
  userId: varchar('user_id')
    .notNull()
    .references(() => usersTable.id),
  token: varchar().unique().notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const passwordVerificationRelations = relations(passwordVerificationsTable, ({ one }) => ({
  user: one(usersTable, { fields: [passwordVerificationsTable.userId], references: [usersTable.id] }),
}))
