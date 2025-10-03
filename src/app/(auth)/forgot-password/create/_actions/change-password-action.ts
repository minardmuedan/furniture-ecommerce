'use server'

import { deletePasswordVerificationDb, getPasswordVerificationByTokenDb } from '@/database/models/password-verifications'
import { updateUserDb } from '@/database/models/users'
import { error } from '@/helpers/server-action'
import { createServerActionWithRateLimiter } from '@/helpers/server-action/with-rate-limit'
import { hashPassword, verifyJWT } from '@/lib/auth'
import { deleteCookie } from '@/lib/headers'
import { createPasswordSchema } from '../_password-schema'

export const changePasswordAction = createServerActionWithRateLimiter(
  async (_attempt, jwtToken: string, values) => {
    const { payload } = await verifyJWT<{ token: string }>(jwtToken)
    if (!payload) error({ type: 'custom_error', message: 'Password verification token not found' })

    const { password } = createPasswordSchema.parse(values)

    const passwordVerificationData = await getPasswordVerificationByTokenDb(payload.token)
    if (!passwordVerificationData) error({ type: 'custom_error', message: 'Password verification token not found' })

    const hashedPassword = await hashPassword(password)
    await updateUserDb(passwordVerificationData.userId, { password: hashedPassword, updatedAt: new Date() })

    await deletePasswordVerificationDb(passwordVerificationData.id)
    await deleteCookie('forgot-password')

    return { success: true, message: 'Password changed successfully! Login to try' }
  },
  { key: 'change-password', maxAttempts: 4, refill: { refilledAttempt: 4, perSeconds: 60 } },
)
