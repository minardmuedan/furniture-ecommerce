import { updateEmailVerificationDb } from '@/database/models/email-verifications'
import { setCookie } from '@/lib/headers'
import { sendEmailVerificationToken } from '@/lib/mailer'
import { generateToken } from '@/lib/token'

export async function regenerateSignupTokenHelper(emailVerificationId: string, user: { email: string }) {
  const { token, jwtToken, expiresAt } = await generateToken()
  await updateEmailVerificationDb(emailVerificationId, { token, expiresAt })

  await sendEmailVerificationToken(user.email, jwtToken)
  await setCookie('signup', emailVerificationId, { maxAge: 60 * 15 })
}
