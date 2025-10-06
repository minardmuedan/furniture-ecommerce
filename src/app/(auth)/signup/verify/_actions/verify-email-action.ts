'use server'

import { deleteEmailVerificationDb, getEmailVerificationByTokenDb } from '@/database/models/email-verifications'
import { getSessionWithUserDb } from '@/database/models/sessions'
import { updateUserDb } from '@/database/models/users'
import createServerAction, { error } from '@/helpers/server-action'
import { verifyJWT } from '@/lib/auth'
import { deleteCookie, getCookie, setCookie } from '@/lib/headers'
import { createSessionCookie, TEMP_SESSION_COOKIE_KEY } from '@/lib/session'

export const verifyEmailAction = createServerAction(async (jwtToken: string) => {
  const { payload } = await verifyJWT<{ token: string }>(jwtToken)
  if (!payload) error({ type: 'custom_error', message: 'Email verification token not found' })

  const emailVerificationData = await getEmailVerificationByTokenDb(payload.token)
  if (!emailVerificationData) error({ type: 'custom_error', message: 'Email verification token not found' })

  await updateUserDb(emailVerificationData.userId, { emailVerified: new Date(), updatedAt: new Date() })
  await deleteEmailVerificationDb(emailVerificationData.id)

  await deleteCookie('signup')

  const tempSessionId = await getCookie(TEMP_SESSION_COOKIE_KEY)
  if (tempSessionId) {
    await deleteCookie(TEMP_SESSION_COOKIE_KEY)
    const session = await getSessionWithUserDb(tempSessionId)
    if (session) {
      await createSessionCookie(session.id)
      return { success: true, message: `Email verified successful — welcome, ${session.user.username}` }
    }
  }

  await setCookie('login', 'initial', { maxAge: 60 * 5 })
  return { success: true, message: 'Email verified successfully, Please login', redirectTo: '/login' }
})
