import { relations } from 'drizzle-orm'
import { pgTable, timestamp, varchar } from 'drizzle-orm/pg-core'
import { usersTable } from './users'

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
