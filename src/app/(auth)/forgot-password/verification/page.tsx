import { getPasswordVerificationWithUserDb } from '@/database/models/password-verifications'
import { getCookie } from '@/lib/headers'
import { Mailbox } from 'lucide-react'
import { notFound } from 'next/navigation'
import ResendPasswordVerificationButton from './_resend-password-verification/resend-button'

export default async function ForgotPasswordVerificationPage() {
  const passwordVerificationId = await getCookie('forgot-password')
  if (!passwordVerificationId) notFound()

  const passwordVerificationData = await getPasswordVerificationWithUserDb(passwordVerificationId)
  if (!passwordVerificationData) notFound()

  if (Date.now() > passwordVerificationData.expiresAt.getTime()) notFound()

  return (
    <>
      <Mailbox className="size-20" />

      <h1 className="mb-2 text-2xl font-semibold">Please check your email</h1>
      <div className="text-muted-foreground mb-5 text-center text-sm">
        email: <span className="text-foreground font-medium">{passwordVerificationData.user.email} </span>
      </div>

      <ResendPasswordVerificationButton />
    </>
  )
}
