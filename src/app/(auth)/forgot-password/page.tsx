import { ButtonLink } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight } from 'lucide-react'
import ForgotPasswordForm from './_fp-form'

export default function ForgotPasswordPage() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Forgot Password?</CardTitle>
        <CardDescription>Enter your email to recieve a link</CardDescription>

        <CardAction>
          <ButtonLink href="/login" variant="link">
            <ArrowRight /> Login
          </ButtonLink>
        </CardAction>
      </CardHeader>
      <CardContent>
        <ForgotPasswordForm />
      </CardContent>
    </Card>
  )
}
