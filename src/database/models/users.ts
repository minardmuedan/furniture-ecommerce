import { and, eq, ilike, isNull, or } from 'drizzle-orm'
import { db } from '..'
import { usersTable } from '../schemas/users'

export const createUserDb = async (values: typeof usersTable.$inferInsert) => await db.insert(usersTable).values(values)

export const getUserByEmailDb = async (email: string) =>
  await db.query.usersTable.findFirst({
    where: (user, { eq }) => eq(user.email, email),
  })

type Option = {
  search?: string | null
  page?: number
  perPage?: number
  orderBy?: {
    column: keyof Pick<typeof usersTable.$inferSelect, 'username' | 'emailVerified' | 'createdAt' | 'updatedAt'>
    order: 'asc' | 'desc'
  }
}

export async function getUsersDb({ search, page = 1, perPage = 20, orderBy = { column: 'createdAt', order: 'desc' } }: Option) {
  const searchWords = search ? search.split(' ').filter(Boolean) : []

  const where = and(
    or(eq(usersTable.isAdmin, false), isNull(usersTable.isAdmin)),
    ...searchWords.map(word => or(ilike(usersTable.username, `%${word}%`), ilike(usersTable.email, `%${word}%`))),
  )

  const getUsers = db.query.usersTable.findMany({
    columns: { password: false, isAdmin: false },
    limit: perPage,
    offset: (page - 1) * perPage,
    where,
    orderBy: (users, { asc, desc, sql }) => {
      if (orderBy.order === 'asc') {
        return sql`${asc(users[orderBy.column])} NULLS LAST`
      } else {
        return sql`${desc(users[orderBy.column])} NULLS LAST`
      }
    },
  })
  const getTotalUsers = db.$count(usersTable, where)

  const [datas, totalDatas] = await Promise.all([getUsers, getTotalUsers])
  return { datas, totalDatas, hasNextPage: totalDatas > page * perPage }
}

export const updateUserDb = async (id: string, values: Partial<typeof usersTable.$inferInsert>) =>
  await db.update(usersTable).set(values).where(eq(usersTable.id, id))
