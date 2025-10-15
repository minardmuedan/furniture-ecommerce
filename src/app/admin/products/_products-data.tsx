'use client'

import CustomReactTable, { CustomReactTableNavbar } from '@/components/custom-table'
import useAdminClientData from '../_use-admin-data'
import { productColumns } from './_product-columns'
import { ProductsData } from './_product-type'

export default function Products({ initialProductsData }: { initialProductsData: ProductsData }) {
  const { search, setSearch, datas, totalDatas, infiniteQuery, reactTable } = useAdminClientData({
    query: { key: 'products', initialData: initialProductsData },
    table: {
      columns: productColumns,
      filterFnRows: ['title'],
      initialVisibilityState: {
        id: false,
        subCategory: false,
        updatedAt: false,
      },
    },
    select: ({ createdAt, updatedAt, ...products }) => ({
      createdAt: new Date(createdAt),
      updatedAt: new Date(updatedAt),
      ...products,
    }),
  })

  return (
    <>
      <CustomReactTableNavbar placeholder="Search for title..." search={search} setSearch={setSearch} columns={reactTable.getAllColumns()} />
      <CustomReactTable
        table={reactTable}
        disabled={infiniteQuery.isPlaceholderData && infiniteQuery.isFetching}
        infiniteQuery={{ dataLength: datas.length, maxDataLength: totalDatas, ...infiniteQuery }}
      />
    </>
  )
}
