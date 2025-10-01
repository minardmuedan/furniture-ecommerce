import { eq } from 'drizzle-orm'
import { db } from '..'
import { usersTable } from '../schema'

export const createUserDb = async (values: typeof usersTable.$inferInsert) => await db.insert(usersTable).values(values)

export const getUserByEmailDb = async (email: string) =>
  await db.query.usersTable.findFirst({
    where: (user, { eq }) => eq(user.email, email),
  })

export const updateUserDb = async (id: string, values: Partial<typeof usersTable.$inferInsert>) =>
  await db.update(usersTable).set(values).where(eq(usersTable.id, id))
