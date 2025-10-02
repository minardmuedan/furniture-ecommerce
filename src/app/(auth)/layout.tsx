import { getCookie } from '@/lib/headers'
import AuthProvider from './_auth-provider'

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const signupLimit = await getCookie('signup-limit')

  return (
    <AuthProvider values={{ signup: signupLimit ? Number(signupLimit) : null }}>
      <div className="min-h-svh-minusNav flex flex-col items-center justify-center py-5">{children}</div>
    </AuthProvider>
  )
}
