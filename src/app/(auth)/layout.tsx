import { getCookie } from '@/lib/headers'
import RateLimitProvider from './_ratelimit-provider'

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const signupLimitDate = await getCookie('signup-limit')
  const resendEmailVerificationDate = await getCookie('resend-email-verification-limit')
  const loginLimitDate = await getCookie('login-limit')

  return (
    <RateLimitProvider
      defaultValues={{
        signup: Number(signupLimitDate || 0),
        resendEmailVerification: Number(resendEmailVerificationDate || 0),
        login: Number(loginLimitDate || 0),
      }}
    >
      <div className="min-h-svh-minusNav flex flex-col items-center justify-center py-5">{children}</div>
    </RateLimitProvider>
  )
}
