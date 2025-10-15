import { getProductsDb } from '@/database/models/products'
import Products from './_products-data'

export default async function AdminProductsPage() {
  const initialProductsData = await getProductsDb({})

  return (
    <>
      <h1 className="mb-4 font-medium">Products</h1>

      <Products initialProductsData={initialProductsData} />
    </>
  )
}
