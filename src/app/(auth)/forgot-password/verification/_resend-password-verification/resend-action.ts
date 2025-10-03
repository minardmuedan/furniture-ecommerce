'use server'

import { getPasswordVerificationWithUserDb } from '@/database/models/password-verifications'
import { error } from '@/helpers/server-action'
import { createServerActionWithRateLimiter } from '@/helpers/server-action/with-rate-limit'
import { getCookie } from '@/lib/headers'
import { regenerateForgotPasswordTokenHelper } from '../../_regenerate-token-helper'

export const resendPasswordVerificationAction = createServerActionWithRateLimiter(
  async () => {
    const passwordVerificationId = await getCookie('forgot-password')
    if (!passwordVerificationId) error({ type: 'custom_error', message: 'Password verification not found' })

    const passwordVerificationData = await getPasswordVerificationWithUserDb(passwordVerificationId)
    if (!passwordVerificationData) error({ type: 'custom_error', message: 'Password verification not found' })

    if (Date.now() > passwordVerificationData.expiresAt.getTime()) error({ type: 'custom_error', message: 'Email verification is expired' })

    await regenerateForgotPasswordTokenHelper(passwordVerificationData.id, passwordVerificationData.user)

    return { success: true }
  },
  { key: 'resend-password-verification-limit', maxAttempts: 1, refill: { refilledAttempt: 1, perSeconds: 30 }, withCookie: true },
)
