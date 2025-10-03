'use client'

import RateLimitButton from '@/app/(auth)/_ratelimit-button'
import { useRateLimitContext } from '@/app/(auth)/_ratelimit-provider'
import { useMutation } from '@tanstack/react-query'
import { Loader2, Send } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { resendEmailVerificationAction } from './resend-action'

export default function ResendEmailVerificationButton() {
  const router = useRouter()
  const { setNextSubmit } = useRateLimitContext('resendEmailVerification')

  const { mutate, isPending } = useMutation({
    mutationKey: ['resend-email-verification'],
    mutationFn: async () => await resendEmailVerificationAction(),
    onSuccess: data => {
      if (!data.success) {
        if (data.type === 'rate_limit') return setNextSubmit(data.data.nextSubmit)

        if (data.type === 'custom_error' || data.type === 'server_error') {
          toast.error(data.message)
          if (data.type === 'custom_error') router.replace('/signup')
        }
      }
    },
  })
  return (
    <RateLimitButton auth="resendEmailVerification" rateLimitMsg="Resend after" disabled={isPending} onClick={() => mutate()}>
      Resend Link {isPending ? <Loader2 className="animate-spin" /> : <Send />}
    </RateLimitButton>
  )
}
