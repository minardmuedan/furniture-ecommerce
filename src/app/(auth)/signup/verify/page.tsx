import { ButtonLink } from '@/components/ui/button'
import { getEmailVerificationByTokenDb } from '@/database/models/email-verifications'
import { verifyJWT } from '@/lib/auth'
import { ArrowLeft, ClockAlert } from 'lucide-react'
import { notFound } from 'next/navigation'
import GenerateEmailVerificationTokenButton from './_generate-token-button'
import VerifyEmailButton from './_verify-email-button'

export default async function VerifyEmailPage({ searchParams }: { searchParams: Promise<{ token: string | undefined }> }) {
  const { token } = await searchParams
  if (!token) notFound()

  const { payload, reason } = await verifyJWT<{ token: string }>(token)
  if (!payload) notFound()

  const emailVerificationData = await getEmailVerificationByTokenDb(payload.token)
  if (!emailVerificationData) notFound()

  if (reason === 'expired')
    return (
      <>
        <ClockAlert className="size-15" />

        <h1 className="mb-2 text-2xl font-bold">Token is Expired</h1>
        <p className="text-muted-foreground mb-5 text-sm">Go to signup page or generate another token</p>

        <div className="flex items-center gap-2">
          <ButtonLink href="/signup" variant="secondary">
            <ArrowLeft /> back to Signup
          </ButtonLink>

          <GenerateEmailVerificationTokenButton emailVerificationId={emailVerificationData.id} />
        </div>
      </>
    )

  return (
    <>
      <h1 className="text-center text-2xl font-bold">Confirm Email Verification</h1>
      <p className="text-muted-foreground mb-5 text-sm">Click the button below to verify your email and activate your account</p>
      <VerifyEmailButton token={token} />
    </>
  )
}
