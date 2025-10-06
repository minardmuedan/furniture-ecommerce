'use server'

import { getEmailVerificationWithUserDb } from '@/database/models/email-verifications'
import createServerAction, { error } from '@/helpers/server-action'
import { setCookie } from '@/lib/headers'
import { regenerateSignupTokenHelper } from '../../_regenerate-token-helper'
import { deleteUserSessions } from '@/database/models/sessions'
import { createSession } from '@/lib/session'

export const generateEmailVerificationTokenAction = createServerAction(async (emailVerificationId: string) => {
  if (!emailVerificationId) error({ type: 'custom_error', message: 'Email verification not found' })

  const emailVerificationData = await getEmailVerificationWithUserDb(emailVerificationId)
  if (!emailVerificationData) error({ type: 'custom_error', message: 'Email verification not found' })

  await regenerateSignupTokenHelper(emailVerificationData.id, emailVerificationData.user)

  await deleteUserSessions(emailVerificationData.user.id)
  await createSession(emailVerificationData.user.id, { temporary: true })

  await setCookie('resend-email-verification-limit', `${Date.now() + 1000 * 30}`, { maxAge: 30 })

  return { success: true }
})
