import { buttonVariants } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import SignupForm from './_signup-form'

export default function SignupPage() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Signup</CardTitle>
        <CardDescription>Complete the credentials to continue</CardDescription>

        <CardAction>
          <Link href="/login" className={buttonVariants({ variant: 'link' })}>
            Login <ArrowRight />
          </Link>
        </CardAction>
      </CardHeader>
      <CardContent>
        <SignupForm />
      </CardContent>
    </Card>
  )
}
