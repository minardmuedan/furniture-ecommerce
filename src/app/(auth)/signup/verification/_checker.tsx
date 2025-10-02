'use client'

import { clientFetch } from '@/helpers/client-fetcher'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { toast } from 'sonner'

type ApiReturnType = { continue: false; success: boolean; message: string } | { continue: true }

export default function EmailVerificationChecker() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { data } = useQuery<ApiReturnType>({
    queryKey: ['check-verification'],
    queryFn: async () => await clientFetch('/auth/check-verification'),
    refetchInterval: ({ state: { data } }) => (data?.continue === false ? false : 5000),
  })

  useEffect(() => {
    if (data && data.continue === false) {
      if (!data.success) {
        toast.error(data.message)
        return router.replace('/signup')
      }

      toast.success(data.message)
      queryClient.invalidateQueries({ queryKey: ['auth'] })
      router.replace('/')
    }
  }, [data])

  return null
}
