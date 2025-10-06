import { ButtonLink } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight } from 'lucide-react'
import SignupForm from './_signup-form'
import Image from 'next/image'

export default function SignupPage() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-end gap-2">
          <Image src="/plant-logo.svg" alt="plant logo" width={16} height={16} />
          Signup
        </CardTitle>
        <CardDescription>Complete the credentials to continue</CardDescription>

        <CardAction>
          <ButtonLink href="/login" variant="link">
            Login <ArrowRight />
          </ButtonLink>
        </CardAction>
      </CardHeader>
      <CardContent>
        <SignupForm />
      </CardContent>
    </Card>
  )
}
