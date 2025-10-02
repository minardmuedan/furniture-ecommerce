import { useEffect } from 'react'
import { useAuthProvider } from './_auth-provider'
import { Button } from '@/components/ui/button'
import useCountDown from '@/hooks/use-countdown'
import useIsHydrated from '@/hooks/use-hydrated'

export default function AuthButton({ auth, children, disabled, ...props }: React.ComponentProps<'button'> & { auth: 'signup' }) {
  const isHydrated = useIsHydrated()
  const { timer, setTimer } = useCountDown()
  const { rateLimit } = useAuthProvider(auth)

  useEffect(() => {
    if (rateLimit) {
      setTimer(Math.ceil((rateLimit - Date.now()) / 1000))
    }
  }, [rateLimit])

  return (
    <Button disabled={!isHydrated || disabled || timer > 0} {...props}>
      {timer > 0 ? `Try again after ${timer} second/s` : children}
    </Button>
  )
}
