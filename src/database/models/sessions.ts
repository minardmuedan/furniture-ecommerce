import { eq } from 'drizzle-orm'
import { db } from '..'
import { sessionsTable } from '../schemas/sessions'

export const createSessionDb = async (values: typeof sessionsTable.$inferInsert) => await db.insert(sessionsTable).values(values)

export const getSessionWithUserDb = async (sessionId: string) =>
  await db.query.sessionsTable.findFirst({
    with: { user: true },
    where: (session, { eq }) => eq(session.id, sessionId),
  })

export const updateSessionDb = async (id: string, values: Partial<typeof sessionsTable.$inferInsert>) =>
  await db.update(sessionsTable).set(values).where(eq(sessionsTable.id, id))

export const deleteSessionDb = async (id: string) => await db.delete(sessionsTable).where(eq(sessionsTable.id, id))
export const deleteUserSessions = async (userId: string) => await db.delete(sessionsTable).where(eq(sessionsTable.userId, userId))
