import { ButtonLink } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'
import LoginForm from './_login-form'

export default function LoginPage() {
  return (
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
  )
}
