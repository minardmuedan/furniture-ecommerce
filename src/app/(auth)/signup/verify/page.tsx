import { getEmailVerificationByTokenDb } from '@/database/models/email-verifications'
import { notFound } from 'next/navigation'
import VerifyEmailButton from './_verify-button'
import { verifyJWT } from '@/lib/auth'

export default async function VerifyEmailPage({ searchParams }: { searchParams: Promise<{ token: string | undefined }> }) {
  const { token } = await searchParams
  if (!token) notFound()

  const payload = await verifyJWT<{ token: string }>(token)
  if (!payload?.token) notFound()

  const emailVerificationData = await getEmailVerificationByTokenDb(payload.token)
  if (!emailVerificationData) notFound()

  return (
    <>
      <h1 className="text-center text-2xl font-bold">Confirm Email Verification</h1>
      <p className="text-muted-foreground mb-5 text-sm">Click the button below to verify your email and activate your account</p>
      <VerifyEmailButton token={token} />
    </>
  )
}
