import { Button } from '@/components/ui/button'
import useCountDown from '@/hooks/use-countdown'
import useIsHydrated from '@/hooks/use-hydrated'
import { useEffect } from 'react'
import { RateLimitedDate, useRateLimitContext } from './_ratelimit-provider'

type Props = React.ComponentProps<'button'> & { auth: keyof RateLimitedDate; rateLimitMsg?: string }

export default function RateLimitButton({ auth, rateLimitMsg = 'Try again after', children, disabled, ...props }: Props) {
  const isHydrated = useIsHydrated()
  const { timer, setTimer } = useCountDown()
  const { nextSubmit } = useRateLimitContext(auth)

  useEffect(() => {
    if (nextSubmit) {
      setTimer(Math.ceil((nextSubmit - Date.now()) / 1000))
    }
  }, [nextSubmit])

  return (
    <>
      <Button disabled={!isHydrated || disabled || timer > 0} {...props}>
        {timer > 0 ? `${rateLimitMsg} ${timer} second/s` : children}
      </Button>
    </>
  )
}
