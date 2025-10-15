import { usersTable } from '@/database/schemas/users'

export type User = Omit<typeof usersTable.$inferSelect, 'password' | 'isAdmin'>

export type UsersData = { datas: User[]; totalDatas: number; hasNextPage: boolean }
