import { getUsersDb } from '@/database/models/users'
import Users from './_users-data'

export default async function AdminUsersPage() {
  const initialUsersData = await getUsersDb({})

  return (
    <>
      <h1 className="mb-4 font-medium">Users</h1>

      <Users initialUsersData={initialUsersData} />
    </>
  )
}
