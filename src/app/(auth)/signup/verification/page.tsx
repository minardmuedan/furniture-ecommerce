import { Spinner } from '@/components/ui/spinner'
import { getEmailVerificationWithUserDb } from '@/database/models/email-verifications'
import { getCookie } from '@/lib/headers'
import { Mailbox } from 'lucide-react'
import { notFound } from 'next/navigation'
import ResendEmailVerificationButton from './_resend-email-verification/resend-button'
import EmailVerificationChecker from './_verification-checker'

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
        <Spinner className="inline" />
      </div>

      <ResendEmailVerificationButton />
    </>
  )
}
