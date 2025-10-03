import { updatePasswordVerificationDb } from '@/database/models/password-verifications'
import { setCookie } from '@/lib/headers'
import { sendPasswordVerificationToken } from '@/lib/mailer'
import { generateToken } from '@/lib/token'

export async function regenerateForgotPasswordTokenHelper(passwordVerificationId: string, user: { email: string }) {
  const expiresAt = new Date(Date.now() + 60_000 * 15) // 15 minutes
  const { token, jwtToken } = await generateToken()
  await updatePasswordVerificationDb(passwordVerificationId, { token, expiresAt })

  await sendPasswordVerificationToken(user.email, jwtToken)
  await setCookie('forgot-password', passwordVerificationId, { maxAge: 60 * 15 })
}
