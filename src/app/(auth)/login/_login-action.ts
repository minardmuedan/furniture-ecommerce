'use server'

import { createServerActionWithRateLimiter } from '@/helpers/server-action/with-rate-limit'
import { loginSchema } from './_login-schema'
import { getUserByEmailDb } from '@/database/models/users'
import { error } from '@/helpers/server-action'
import { verifyPassword } from '@/lib/auth'
import { deleteCookie, getCookie } from '@/lib/headers'
import { deleteUserSessions } from '@/database/models/sessions'
import { createSession } from '@/lib/session'

export const loginAction = createServerActionWithRateLimiter(
  async (_attempt, values) => {
    const { email, password } = loginSchema.parse(values)

    const user = await getUserByEmailDb(email)
    if (!user) error({ type: 'custom_error', message: 'User not found' })

    const comparePassword = await verifyPassword(password, user.password)
    if (!comparePassword) error({ type: 'custom_error', message: 'Incorrect credentials. Please try again' })

    if (!user.emailVerified) error({ type: 'validation_error', fields: { email: 'Email is not yet verified! Please signup' } })

    const isInitialLoginAttempt = (await getCookie('login')) === 'initial'
    if (isInitialLoginAttempt) {
      await deleteUserSessions(user.id)
      await deleteCookie('login')
    }

    await createSession(user.id)

    if (isInitialLoginAttempt) return { success: true, message: `Welcome, ${user.username}! Lets get you started` }
    return { success: true, message: `Good to see you again, ${user.username}` }
  },
  { key: 'login-limit', maxAttempts: 12, refill: { refilledAttempt: 6, perSeconds: 60 }, withCookie: true },
)
