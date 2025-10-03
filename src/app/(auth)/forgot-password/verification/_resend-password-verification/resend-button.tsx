'use client'

import RateLimitButton from '@/app/(auth)/_ratelimit-button'
import { useRateLimitContext } from '@/app/(auth)/_ratelimit-provider'
import { useMutation } from '@tanstack/react-query'
import { Loader2, Send } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { resendPasswordVerificationAction } from './resend-action'

export default function ResendPasswordVerificationButton() {
  const router = useRouter()
  const { setNextSubmit } = useRateLimitContext('resendPasswordVerification')

  const { mutate, isPending } = useMutation({
    mutationKey: ['resend-password-verification'],
    mutationFn: async () => await resendPasswordVerificationAction(),
    onSuccess: data => {
      if (!data.success) {
        if (data.type === 'rate_limit') return setNextSubmit(data.data.nextSubmit)

        if (data.type === 'custom_error' || data.type === 'server_error') {
          toast.error(data.message)
          if (data.type === 'custom_error') router.replace('/forgot-password')
        }
      }
    },
  })
  return (
    <RateLimitButton auth="resendPasswordVerification" rateLimitMsg="Resend after" disabled={isPending} onClick={() => mutate()}>
      Resend Link {isPending ? <Loader2 className="animate-spin" /> : <Send />}
    </RateLimitButton>
  )
}
