import { eq } from 'drizzle-orm'
import { db } from '..'
import { passwordVerificationsTable } from '../schema'

export const createPasswordVerificationDb = async (values: typeof passwordVerificationsTable.$inferInsert) =>
  await db.insert(passwordVerificationsTable).values(values)

export const getPasswordVerificationWithUserDb = async (passwordVerificationId: string) =>
  await db.query.passwordVerificationsTable.findFirst({
    with: { user: true },
    where: (passwordVerification, { eq }) => eq(passwordVerification.id, passwordVerificationId),
  })

export const getPasswordVerificationByTokenDb = async (token: string) =>
  await db.query.passwordVerificationsTable.findFirst({ where: (passwordVerification, { eq }) => eq(passwordVerification.token, token) })

export const updatePasswordVerificationDb = async (id: string, values: Partial<typeof passwordVerificationsTable.$inferInsert>) =>
  await db.update(passwordVerificationsTable).set(values).where(eq(passwordVerificationsTable.id, id))

export const deletePasswordVerificationDb = async (id: string) =>
  await db.delete(passwordVerificationsTable).where(eq(passwordVerificationsTable.id, id))
