import { updatePasswordVerificationDb } from '@/database/models/password-verifications'
import { setCookie } from '@/lib/headers'
import { sendPasswordVerificationToken } from '@/lib/mailer'
import { generateToken } from '@/lib/token'

export async function regenerateForgotPasswordTokenHelper(passwordVerificationId: string, user: { email: string }) {
  const { token, jwtToken, expiresAt } = await generateToken()
  await updatePasswordVerificationDb(passwordVerificationId, { token, expiresAt })

  await sendPasswordVerificationToken(user.email, jwtToken)
  await setCookie('forgot-password', passwordVerificationId, { maxAge: 60 * 15 })
}
