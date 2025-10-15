import { productsTable } from '@/database/schemas/products'

export type Product = typeof productsTable.$inferSelect
export type ProductsData = { datas: Product[]; totalDatas: number; hasNextPage: boolean }
