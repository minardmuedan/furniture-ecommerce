import { and, ilike } from 'drizzle-orm'
import { db } from '..'
import { productsTable } from '../schemas/products'

export const createProductDb = async (values: typeof productsTable.$inferInsert) => await db.insert(productsTable).values(values)

export async function getProductsDb({ search, page = 1, perPage = 20, orderBy = { column: 'createdAt', order: 'desc' } }: Option) {
  const searchWords = search ? search.split(' ').filter(Boolean) : undefined
  const where = searchWords && and(...searchWords.map(word => ilike(productsTable.title, `%${word}%`)))

  const getProducts = db.query.productsTable.findMany({
    limit: perPage,
    offset: (page - 1) * perPage,
    where,
    orderBy: (product, helper) => helper[orderBy.order](product[orderBy.column]),
  })
  const getTotalProducts = db.$count(productsTable, where)

  const [datas, totalDatas] = await Promise.all([getProducts, getTotalProducts])
  return { datas, totalDatas, hasNextPage: totalDatas > page * perPage }
}

type Option = {
  search?: string | null
  page?: number
  perPage?: number
  orderBy?: {
    column: keyof Pick<typeof productsTable.$inferSelect, 'title' | 'price' | 'stocks' | 'createdAt' | 'updatedAt'>
    order: 'asc' | 'desc'
  }
}
