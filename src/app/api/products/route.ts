import { getProductsDb, ProductsDbOrderBy } from '@/database/models/products'
import { NextRequest, NextResponse } from 'next/server'

const allowedColumns: ProductsDbOrderBy['column'][] = ['title', 'createdAt', 'updatedAt', 'price', 'stocks']
const allowedOrders: ProductsDbOrderBy['order'][] = ['asc', 'desc']

type Column = ProductsDbOrderBy['column']
type Order = ProductsDbOrderBy['order']

export async function GET(req: NextRequest) {
  const search = req.nextUrl.searchParams.get('search')
  const page = Number(req.nextUrl.searchParams.get('page') ?? 1)

  const orderBy = req.nextUrl.searchParams.get('orderBy')
  const orderByParts = orderBy ? orderBy.split('.') : undefined

  let orderByOption: { column: Column; order: Order } | undefined = undefined

  if (orderByParts && allowedColumns.includes(orderByParts[0] as Column) && allowedOrders.includes(orderByParts[1] as Order)) {
    orderByOption = { column: orderByParts[0] as Column, order: orderByParts[1] as Order }
  }

  const products = await getProductsDb({
    search,
    page,
    orderBy: orderByOption,
  })
  return NextResponse.json(products)
}
