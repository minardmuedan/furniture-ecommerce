'use client'

import { useRateLimitContext } from '@/app/(auth)/_ratelimit-provider'
import { Button } from '@/components/ui/button'
import { useMutation } from '@tanstack/react-query'
import { RotateCcw } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { generateEmailVerificationTokenAction } from '../_actions/generate-token-action'

export default function GenerateEmailVerificationTokenButton({ emailVerificationId }: { emailVerificationId: string }) {
  const router = useRouter()
  const { setNextSubmit } = useRateLimitContext('resendEmailVerification')

  const { mutate, isPending } = useMutation({
    mutationKey: ['resend-email-verification'],
    mutationFn: async () => await generateEmailVerificationTokenAction(emailVerificationId),
    onSuccess: data => {
      if (!data.success) {
        if (data.type === 'custom_error' || data.type === 'server_error') {
          toast.error(data.message)
          if (data.type === 'custom_error') router.replace('/signup')
        }
      } else {
        setNextSubmit(Date.now() + 30_000)
        router.replace('/signup/verification')
      }
    },
  })
  return (
    <Button disabled={isPending} onClick={() => mutate()}>
      Generate Token <RotateCcw className={isPending ? 'animate-spin' : ''} />
    </Button>
  )
}
