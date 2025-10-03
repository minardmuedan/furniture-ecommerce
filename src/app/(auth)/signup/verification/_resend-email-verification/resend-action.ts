'use server'

import { getEmailVerificationWithUserDb } from '@/database/models/email-verifications'
import { error } from '@/helpers/server-action'
import { createServerActionWithRateLimiter } from '@/helpers/server-action/with-rate-limit'
import { getCookie } from '@/lib/headers'
import { regenerateSignupTokenHelper } from '../../_regenerate-token-helper'

export const resendEmailVerificationAction = createServerActionWithRateLimiter(
  async () => {
    const emailVerificationId = await getCookie('signup')
    if (!emailVerificationId) error({ type: 'custom_error', message: 'Email verification not found' })

    const emailVerificationData = await getEmailVerificationWithUserDb(emailVerificationId)
    if (!emailVerificationData) error({ type: 'custom_error', message: 'Email verification not found' })

    if (Date.now() > emailVerificationData.expiresAt.getTime()) error({ type: 'custom_error', message: 'Email verification is expired' })

    await regenerateSignupTokenHelper(emailVerificationData.id, emailVerificationData.user)

    return { success: true }
  },
  { key: 'resend-email-verification-limit', maxAttempts: 1, refill: { refilledAttempt: 1, perSeconds: 30 }, withCookie: true },
)
