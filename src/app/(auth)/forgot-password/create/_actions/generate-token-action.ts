'use server'

import { getPasswordVerificationWithUserDb } from '@/database/models/password-verifications'
import createServerAction, { error } from '@/helpers/server-action'
import { setCookie } from '@/lib/headers'
import { regenerateForgotPasswordTokenHelper } from '../../_regenerate-token-helper'

export const generatePasswordVerificationTokenAction = createServerAction(async (passwordVerificationId: string) => {
  if (!passwordVerificationId) error({ type: 'custom_error', message: 'Password verification not found' })

  const passwordVerificationData = await getPasswordVerificationWithUserDb(passwordVerificationId)
  if (!passwordVerificationData) error({ type: 'custom_error', message: 'Password verification not found' })

  await regenerateForgotPasswordTokenHelper(passwordVerificationData.id, passwordVerificationData.user)

  await setCookie('resend-password-verification-limit', `${Date.now() + 1000 * 30}`, { maxAge: 30 })

  return { success: true }
})
