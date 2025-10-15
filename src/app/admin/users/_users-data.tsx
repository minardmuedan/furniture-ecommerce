'use client'

import CustomReactTable, { CustomReactTableNavbar } from '@/components/custom-table'
import useAdminClientData from '../_use-admin-data'
import { userColumns } from './_user-columns'
import { UsersData } from './_user-type'

export default function Users({ initialUsersData }: { initialUsersData: UsersData }) {
  const { search, setSearch, datas, totalDatas, infiniteQuery, reactTable } = useAdminClientData({
    query: { key: 'users', initialData: initialUsersData },
    table: {
      columns: userColumns,
      filterFnRows: ['username', 'email'],
      initialVisibilityState: {
        id: false,
        emailVerified: false,
        updatedAt: false,
      },
    },
    select: ({ emailVerified, createdAt, updatedAt, ...user }) => ({
      emailVerified: emailVerified && new Date(emailVerified),
      createdAt: new Date(createdAt),
      updatedAt: new Date(updatedAt),
      ...user,
    }),
  })

  return (
    <>
      <CustomReactTableNavbar
        placeholder="Search for username or email..."
        search={search}
        setSearch={setSearch}
        columns={reactTable.getAllColumns()}
      />
      <CustomReactTable
        table={reactTable}
        disabled={infiniteQuery.isPlaceholderData && infiniteQuery.isFetching}
        infiniteQuery={{ dataLength: datas.length, maxDataLength: totalDatas, ...infiniteQuery }}
      />
    </>
  )
}
