'use server'

import { createPasswordVerificationDb } from '@/database/models/password-verifications'
import { getUserByEmailDb } from '@/database/models/users'
import { error } from '@/helpers/server-action'
import { createServerActionWithRateLimiter } from '@/helpers/server-action/with-rate-limit'
import { generateSecureRandomString } from '@/lib/auth'
import { setCookie } from '@/lib/headers'
import { sendPasswordVerificationToken } from '@/lib/mailer'
import { generateToken } from '@/lib/token'
import { forgotPasswordSchema } from './_fp-schema'

export const forgotPasswordAction = createServerActionWithRateLimiter(
  async (_attempt, values) => {
    const { email } = forgotPasswordSchema.parse(values)
    const user = await getUserByEmailDb(email)
    if (!user) error({ type: 'custom_error', message: 'User not found! Please try again' })
    if (!user.emailVerified) error({ type: 'validation_error', fields: { email: 'Email is not yet verified! Please signup' } })

    const passwordVerificationId = generateSecureRandomString()
    const expiresAt = new Date(Date.now() + 60_000 * 15) // 15 minutes
    const { token, jwtToken } = await generateToken()
    await createPasswordVerificationDb({ id: passwordVerificationId, userId: user.id, token, expiresAt })

    await sendPasswordVerificationToken(email, jwtToken)

    await setCookie('forgot-password', passwordVerificationId, { maxAge: 60 * 15 })
    await setCookie('resend-password-verification-limit', `${Date.now() + 1000 * 30}`, { maxAge: 30 })
    return { success: true }
  },
  { key: 'forgot-password-limit', maxAttempts: 5, refill: { refilledAttempt: 3, perSeconds: 60 }, withCookie: true },
)
