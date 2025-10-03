'use client'

import { Button } from '@/components/ui/button'
import { useMutation } from '@tanstack/react-query'
import { RotateCcw } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { generateEmailVerificationTokenAction } from './_actions/generate-token-action'
import { useRateLimitContext } from '../../_ratelimit-provider'

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
        router.replace('/signup/verification')
        setNextSubmit(Date.now() + 1000 * 30)
      }
    },
  })
  return (
    <Button disabled={isPending} onClick={() => mutate()}>
      Generate Token <RotateCcw className={isPending ? 'animate-spin' : ''} />
    </Button>
  )
}
