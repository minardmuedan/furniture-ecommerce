import { updateEmailVerification } from '@/database/models/email-verifications'
import { setCookie } from '@/lib/headers'
import { sendEmailVerificationToken } from '@/lib/mailer'
import { generateToken } from '@/lib/token'

export async function regenerateSignupTokenHelper(emailVerificationId: string, user: { email: string }) {
  const expiresAt = new Date(Date.now() + 60_000 * 60 * 15) // 15 minutes
  const { token, jwtToken } = await generateToken()
  await updateEmailVerification(emailVerificationId, { token, expiresAt })

  await sendEmailVerificationToken(user.email, jwtToken)
  await setCookie('signup', emailVerificationId, { maxAge: 60 * 15 })
}
