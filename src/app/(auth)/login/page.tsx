import { ButtonLink } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'
import LoginForm from './_login-form'
import Image from 'next/image'

export default function LoginPage() {
  return (
    <>
      <Image src="/plant-logo.svg" alt="plant logo" width={60} height={60} className="mb-6" />
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Complete the credentials to continue</CardDescription>

          <CardAction>
            <ButtonLink href="/signup" variant="link">
              <ArrowLeft /> Signup
            </ButtonLink>
          </CardAction>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </>
  )
}
