import { getUsersDb } from '@/database/models/users'
import { NextRequest, NextResponse } from 'next/server'

const allowedColumns = ['username', 'emailVerified', 'createdAt', 'updatedAt'] as const
const allowedOrders = ['asc', 'desc'] as const

type Column = (typeof allowedColumns)[number]
type Order = (typeof allowedOrders)[number]

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
