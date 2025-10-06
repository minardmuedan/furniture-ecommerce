'use client'

import { Spinner } from '@/components/ui/spinner'
import { useMutation } from '@tanstack/react-query'
import { Send } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import RateLimitButton from '../../../_ratelimit-button'
import { useRateLimitContext } from '../../../_ratelimit-provider'
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
      Resend Link {isPending ? <Spinner /> : <Send />}
    </RateLimitButton>
  )
}
