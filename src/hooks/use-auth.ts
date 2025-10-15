import { clientFetch } from '@/helpers/client-fetcher'
import { logoutAction } from '@auth/_logout/logout-action'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { toast } from 'sonner'

export type ClientAuthUser = {
  username: string
  email: string
  avatarSrc: string | null
  createdAt: Date
  isAdmin: true | undefined
}

export function useAuth() {
  const { data, isLoading, error } = useQuery<ClientAuthUser>({
    queryKey: ['session'],
    queryFn: async () => await clientFetch('/auth/session'),
  })

  useEffect(() => {
    if (error) toast.error(error)
  }, [error])

  return { user: data, isGettingUser: isLoading }
}

export function useLogout() {
  const queryClient = useQueryClient()
  const router = useRouter()
  const { mutate, isPending } = useMutation({
    mutationKey: ['logout'],
    mutationFn: async () => await logoutAction(),
    onSettled: (data, error) => {
      if (data?.success) {
        toast.success('Your account has been logout')
        router.replace('/login')
      } else if (data?.type === 'server_error') toast.error(data.message)

      if (error) toast.error('Something went wrong! Please reload the page')
      queryClient.invalidateQueries({ queryKey: ['session'] })
    },
  })

  return { logout: mutate, isLogouting: isPending }
}
