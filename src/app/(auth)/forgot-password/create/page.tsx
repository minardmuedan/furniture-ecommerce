import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { notFound } from 'next/navigation'
import { verifyJWT } from '@/lib/auth'
import { getPasswordVerificationByTokenDb } from '@/database/models/password-verifications'
import { ArrowLeft, ClockAlert } from 'lucide-react'
import { ButtonLink } from '@/components/ui/button'
import ChangePasswordForm from './_components/change-password-form'
import GeneratePasswordVerificationTokenButton from './_components/generate-token-button'

export default async function ChangePasswordPage({ searchParams }: { searchParams: Promise<{ token: string | undefined }> }) {
  const { token } = await searchParams
  if (!token) notFound()

  const { payload, reason } = await verifyJWT<{ token: string }>(token)
  if (!payload) notFound()

  const passwordVerificationData = await getPasswordVerificationByTokenDb(payload.token)
  if (!passwordVerificationData) notFound()

  if (reason === 'expired')
    return (
      <>
        <ClockAlert className="size-15" />

        <h1 className="mb-2 text-2xl font-bold">Token is Expired</h1>
        <p className="text-muted-foreground mb-5 text-sm">Go to login page or generate another token</p>

        <div className="flex items-center gap-2">
          <ButtonLink href="/login" variant="secondary">
            <ArrowLeft /> Login
          </ButtonLink>

          <GeneratePasswordVerificationTokenButton passwordVerificationId={passwordVerificationData.id} />
        </div>
      </>
    )

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Create new password</CardTitle>
        <CardDescription>Fill up the credentials to change your password</CardDescription>
      </CardHeader>
      <CardContent>
        <ChangePasswordForm token={token} />
      </CardContent>
    </Card>
  )
}
