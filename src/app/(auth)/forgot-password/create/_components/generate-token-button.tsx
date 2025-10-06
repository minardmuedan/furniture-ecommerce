'use client'

import { Button } from '@/components/ui/button'
import { useMutation } from '@tanstack/react-query'
import { RotateCcw } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useRateLimitContext } from '../../../_ratelimit-provider'
import { generatePasswordVerificationTokenAction } from '../_actions/generate-token-action'

export default function GeneratePasswordVerificationTokenButton({ passwordVerificationId }: { passwordVerificationId: string }) {
  const router = useRouter()
  const { setNextSubmit } = useRateLimitContext('resendPasswordVerification')

  const { mutate, isPending } = useMutation({
    mutationKey: ['resend-password-verification'],
    mutationFn: async () => await generatePasswordVerificationTokenAction(passwordVerificationId),
    onSuccess: data => {
      if (!data.success) {
        if (data.type === 'custom_error' || data.type === 'server_error') {
          toast.error(data.message)
          if (data.type === 'custom_error') router.replace('/forgot-password')
        }
      } else {
        setNextSubmit(Date.now() + 30_000)
        router.replace('/forgot-password/verification')
      }
    },
  })
  return (
    <Button disabled={isPending} onClick={() => mutate()}>
      Generate Token <RotateCcw className={isPending ? 'animate-spin' : ''} />
    </Button>
  )
}
