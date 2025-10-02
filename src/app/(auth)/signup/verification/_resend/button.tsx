'use client'

import { Button } from '@/components/ui/button'
import useCountDown from '@/hooks/use-countdown'
import { useMutation } from '@tanstack/react-query'
import { Loader2, Send } from 'lucide-react'
import { resendEmailVerificationAction } from './_action'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export default function ResendEmailVerificationButton() {
  const router = useRouter()
  const { timer, setTimer } = useCountDown()

  const { mutate, isPending } = useMutation({
    mutationKey: ['resend-email-verification'],
    mutationFn: async () => await resendEmailVerificationAction(),
    onSuccess: data => {
      if (!data.success) {
        if (data.type === 'rate_limit') return setTimer(data.data.remainingSeconds)

        if (data.type === 'custom_error' || data.type === 'server_error') {
          toast.error(data.message)
          if (data.type === 'custom_error') router.replace('/signup')
        }
      }
    },
  })
  return (
    <Button disabled={isPending || timer > 0} onClick={() => mutate()}>
      {timer > 0 ? `Resend after ${timer} second/s` : <>Resend Link {isPending ? <Loader2 className="animate-spin" /> : <Send />}</>}
    </Button>
  )
}
