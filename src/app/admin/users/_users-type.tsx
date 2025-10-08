import { type usersTable } from '@/database/schema'

export type AdminUserType = Omit<typeof usersTable.$inferSelect, 'isAdmin' | 'password'>
