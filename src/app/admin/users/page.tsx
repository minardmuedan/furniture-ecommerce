import { getUsersDb } from '@/database/models/users'
import AdminUsersTable from './_users-table'

export default async function AdminUsersPage() {
  const users = await getUsersDb()

  return (
    <>
      <h1 className="text-muted-foreground mb-4 font-medium">Users</h1>

      <AdminUsersTable initialUser={users} />
    </>
  )
}
