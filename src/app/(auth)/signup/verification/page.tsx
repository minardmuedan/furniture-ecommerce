import { getEmailVerificationWithUserDb } from '@/database/models/email-verifications'
import { getCookie } from '@/lib/headers'
import { notFound } from 'next/navigation'
import EmailVerificationChecker from './_checker'
import ResendEmailVerificationButton from './_resend/button'
import { Loader2, Mailbox } from 'lucide-react'

export default async function SignupVerificationPage() {
  const emailVerificationId = await getCookie('signup')
  if (!emailVerificationId) notFound()

  const emailVerificationData = await getEmailVerificationWithUserDb(emailVerificationId)
  if (!emailVerificationData) notFound()

  if (Date.now() > emailVerificationData.expiresAt.getTime()) notFound()

  return (
    <>
      <EmailVerificationChecker />

      <Mailbox className="size-20" />

      <h1 className="mb-2 text-2xl font-semibold">Please check your email</h1>
      <div className="text-muted-foreground mb-5 text-center text-sm">
        email: <span className="text-foreground font-medium">{emailVerificationData.user.email} </span>
        <Loader2 className="inline size-4 animate-spin" />
      </div>

      <ResendEmailVerificationButton />
    </>
  )
}
