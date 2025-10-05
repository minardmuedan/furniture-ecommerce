import { getCookie } from '@/lib/headers'
import RateLimitProvider from './_ratelimit-provider'

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const signupLimitTimestamp = await getCookie('signup-limit')
  const resendEmailVerificationTimestamp = await getCookie('resend-email-verification-limit')
  const loginLimitTimestamp = await getCookie('login-limit')
  const forgotPasswordLimitTimestamp = await getCookie('password-verification-limit')
  const resendPasswordVerificationLimitTimestamp = await getCookie('resend-password-verification-limit')

  return (
    <RateLimitProvider
      defaultValues={{
        signup: Number(signupLimitTimestamp || 0),
        resendEmailVerification: Number(resendEmailVerificationTimestamp || 0),
        login: Number(loginLimitTimestamp || 0),
        forgotPassword: Number(forgotPasswordLimitTimestamp || 0),
        resendPasswordVerification: Number(resendPasswordVerificationLimitTimestamp || 0),
      }}
    >
      <div className="min-h-svh-minusNav flex flex-col items-center justify-center py-5">{children}</div>
    </RateLimitProvider>
  )
}
