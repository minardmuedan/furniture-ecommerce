import { db } from '..'
import { emailVerificationsTable } from '../schema'

export const createEmailVerificationDb = async (values: typeof emailVerificationsTable.$inferInsert) =>
  await db.insert(emailVerificationsTable).values(values)
