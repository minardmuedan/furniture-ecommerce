import { buttonVariants } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getCookie } from '@/lib/headers'
import Link from 'next/link'
import SignupForm from './_signup-form'
import { ArrowRight } from 'lucide-react'

export default async function SignupPage() {
  const signupRateLimit = await getCookie('signup-limit')

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
        <SignupForm rateLimitDate={signupRateLimit ? Number(signupRateLimit) : 0} />
      </CardContent>
    </Card>
  )
}
