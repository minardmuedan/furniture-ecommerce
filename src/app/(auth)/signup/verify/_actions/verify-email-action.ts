'use server'

import { deleteEmailVerificationDb, getEmailVerificationByTokenDb } from '@/database/models/email-verifications'
import { updateUserDb } from '@/database/models/users'
import createServerAction, { error } from '@/helpers/server-action'
import { verifyJWT } from '@/lib/auth'
import { deleteCookie, setCookie } from '@/lib/headers'
import { getSession } from '@/lib/session'

export const verifyEmailAction = createServerAction(async (jwtToken: string) => {
  const { payload } = await verifyJWT<{ token: string }>(jwtToken)
  if (!payload) error({ type: 'custom_error', message: 'Email verification token not found' })

  const emailVerificationData = await getEmailVerificationByTokenDb(payload.token)
  if (!emailVerificationData) error({ type: 'custom_error', message: 'Email verification token not found' })

  await updateUserDb(emailVerificationData.userId, { emailVerified: new Date(), updatedAt: new Date() })
  await deleteEmailVerificationDb(emailVerificationData.id)
  await deleteCookie('signup')

  const { session } = await getSession()
  if (session) return { success: true, message: `Email verified successful — welcome, ${session.user.username}` }

  await setCookie('login', 'initial', { maxAge: 60 * 5 })
  return { success: true, message: 'Email verified successfully, Please login', redirectTo: '/login' }
})
