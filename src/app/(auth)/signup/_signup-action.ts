'use server'

import { createUserDb, getUserByEmailDb, updateUserDb } from '@/database/models/users'
import { error } from '@/helpers/server-action'
import { createServerActionWithRateLimiter } from '@/helpers/server-action/with-rate-limit'
import { generateSecureRandomString, hashPassword } from '@/lib/auth'
import { signupSchema } from './_signup-schema'
import { createEmailVerificationDb } from '@/database/models/email-verifications'
import { sendEmailVerificationToken } from '@/lib/mailer'
import { redirect } from 'next/navigation'
import { createSession } from '@/lib/session'
import { setCookie } from '@/lib/headers'
import { generateToken } from '@/lib/token'

export const signupAction = createServerActionWithRateLimiter(
  async (_attempt, values) => {
    const { username, email, password } = signupSchema.parse(values)

    const existingUser = await getUserByEmailDb(email)
    if (existingUser && existingUser.emailVerified) {
      error({ type: 'validation_error', fields: { email: 'Email already in use' } })
    }

    let userId: string
    const hashedPassword = await hashPassword(password)
    if (existingUser) {
      userId = existingUser.id
      await updateUserDb(existingUser.id, { username, password: hashedPassword, updatedAt: new Date() })
    } else {
      userId = generateSecureRandomString()
      await createUserDb({ id: userId, username, email, password: hashedPassword })
    }

    const emailVerificationId = generateSecureRandomString()
    const expiresAt = new Date(Date.now() + 60_000 * 60 * 15) // 15 minutes
    const { token, jwtToken } = await generateToken()
    await createEmailVerificationDb({ id: emailVerificationId, userId, token, expiresAt })
    await setCookie('signup', emailVerificationId, { maxAge: 60 * 15 })
    await sendEmailVerificationToken(email, jwtToken)

    await createSession(userId)
    redirect('/signup/verification')
  },

  { key: 'signup-limit', maxAttempts: 10, refill: { refilledAttempt: 5, perSeconds: 30 }, withCookie: true },
)
