'use client'

import { Button } from '@/components/ui/button'
import { useMutation } from '@tanstack/react-query'
import { verifyEmailAction } from './_actions/verify-email-action'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export default function VerifyEmailButton({ token }: { token: string }) {
  const router = useRouter()
  const { mutate, isPending } = useMutation({
    mutationKey: ['verify-email'],
    mutationFn: async () => await verifyEmailAction(token),
    onSuccess: data => {
      if (data.success) {
        toast.success(data.message, { icon: '🎉' })
        return router.replace(data.redirectTo ?? '/')
      }

      if (data.type === 'custom_error' || data.type === 'server_error') {
        toast.error(data.message)
        if (data.type === 'custom_error') router.replace('/signup')
      }
    },
    onError: () => toast.error('Something went wrong, Please try again'),
  })

  return (
    <Button disabled={isPending} onClick={() => mutate()}>
      {isPending ? 'Verfying your email...' : 'Verify my email'}
    </Button>
  )
}
