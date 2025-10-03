'use server'

import createServerAction from '@/helpers/server-action'
import { deleteSession } from '@/lib/session'

export const logoutAction = createServerAction(async () => {
  await deleteSession()
  return { success: true }
})
