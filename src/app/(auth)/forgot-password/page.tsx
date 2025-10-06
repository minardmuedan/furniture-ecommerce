import { ButtonLink } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'
import ForgotPasswordForm from './_fp-form'
import Image from 'next/image'

export default function ForgotPasswordPage() {
  return (
    <>
      <Image src="/plant-logo.svg" alt="plant logo" width={60} height={60} className="mb-6" />

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Forgot Password?</CardTitle>
          <CardDescription>Enter your email to recieve a link</CardDescription>

          <CardAction>
            <ButtonLink href="/login" variant="link">
              <ArrowLeft /> Login
            </ButtonLink>
          </CardAction>
        </CardHeader>
        <CardContent>
          <ForgotPasswordForm />
        </CardContent>
      </Card>
    </>
  )
}
