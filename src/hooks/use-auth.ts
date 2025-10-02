import { clientFetch } from '@/helpers/client-fetcher'
import { useQuery } from '@tanstack/react-query'

export type ClientAuthUser = {
  username: string
  email: string
  avatarSrc: string | null
  createdAt: Date
  isAdmin: true | undefined
}

export const useAuth = () => {
  const { data: user, isLoading: isGettingUser } = useQuery<AuthCClientAuthUserlientUser>({
    queryKey: ['auth'],
    queryFn: async () => await clientFetch('/auth'),
  })

  return { user, isGettingUser }
}
