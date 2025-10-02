'use server'

import { getEmailVerificationWithUserDb, updateEmailVerification } from '@/database/models/email-verifications'
import { error } from '@/helpers/server-action'
import { createServerActionWithRateLimiter } from '@/helpers/server-action/with-rate-limit'
import { generateSecureRandomString, signJWT } from '@/lib/auth'
import { getCookie, setCookie } from '@/lib/headers'
import { sendEmailVerificationToken } from '@/lib/mailer'

export const resendEmailVerificationAction = createServerActionWithRateLimiter(
  async _attempt => {
    const emailVerificationId = await getCookie('signup')
    if (!emailVerificationId) error({ type: 'custom_error', message: 'Email verification not found' })

    const emailVerificationData = await getEmailVerificationWithUserDb(emailVerificationId)
    if (!emailVerificationData) error({ type: 'custom_error', message: 'Email verification not found' })

    if (Date.now() > emailVerificationData.expiresAt.getTime()) error({ type: 'custom_error', message: 'Email verification is expired' })

    const token = generateSecureRandomString()
    const expiresAt = new Date(Date.now() + 60_000 * 60 * 15)
    await updateEmailVerification(emailVerificationData.id, { token, expiresAt })

    const jwtToken = await signJWT({ token }, 15)
    await sendEmailVerificationToken(emailVerificationData.user.email, jwtToken)
    await setCookie('signup', emailVerificationId, { maxAge: 60 * 15 })

    return { success: true }
  },
  { key: 'resend-email-verification-limit', maxAttempts: 1, refill: { refilledAttempt: 1, perSeconds: 30 }, withCookie: true },
)
