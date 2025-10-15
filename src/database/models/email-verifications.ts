import { eq } from 'drizzle-orm'
import { db } from '..'
import { emailVerificationsTable } from '../schemas/email-verifications'

export const createEmailVerificationDb = async (values: typeof emailVerificationsTable.$inferInsert) =>
  await db.insert(emailVerificationsTable).values(values)

export const getEmailVerificationWithUserDb = async (emailVerificationId: string) =>
  await db.query.emailVerificationsTable.findFirst({
    with: { user: true },
    where: (emailVerification, { eq }) => eq(emailVerification.id, emailVerificationId),
  })

export const getEmailVerificationByTokenDb = async (token: string) =>
  await db.query.emailVerificationsTable.findFirst({ where: (emailVerification, { eq }) => eq(emailVerification.token, token) })

export const updateEmailVerificationDb = async (id: string, values: Partial<typeof emailVerificationsTable.$inferInsert>) =>
  await db.update(emailVerificationsTable).set(values).where(eq(emailVerificationsTable.id, id))

export const deleteEmailVerificationDb = async (id: string) => await db.delete(emailVerificationsTable).where(eq(emailVerificationsTable.id, id))
