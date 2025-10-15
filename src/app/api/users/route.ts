import { getUsersDb, UsersDbOrderBy } from '@/database/models/users'
import { NextRequest, NextResponse } from 'next/server'

const allowedColumns: UsersDbOrderBy['column'][] = ['username', 'createdAt', 'updatedAt']
const allowedOrders: UsersDbOrderBy['order'][] = ['asc', 'desc']

type Column = UsersDbOrderBy['column']
type Order = UsersDbOrderBy['order']

export async function GET(req: NextRequest) {
  const search = req.nextUrl.searchParams.get('search')
  const page = Number(req.nextUrl.searchParams.get('page') ?? 1)

  const orderBy = req.nextUrl.searchParams.get('orderBy')
  const orderByParts = orderBy ? orderBy.split('.') : undefined

  let orderByOption: { column: Column; order: Order } | undefined = undefined

  if (orderByParts && allowedColumns.includes(orderByParts[0] as Column) && allowedOrders.includes(orderByParts[1] as Order)) {
    orderByOption = { column: orderByParts[0] as Column, order: orderByParts[1] as Order }
  }

  const users = await getUsersDb({
    search,
    page,
    orderBy: orderByOption,
  })
  return NextResponse.json(users)
}
