import { Button, buttonVariants } from '@/components/ui/button'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { VariantProps } from 'class-variance-authority'
import { logoutAction } from './logout-action'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Loader2, LogOut } from 'lucide-react'

type Props = Omit<React.ComponentProps<'button'>, 'children' | 'onClick'> & VariantProps<typeof buttonVariants>

export default function LogoutButton({ disabled, ...props }: Props) {
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

  return (
    <Button disabled={disabled || isPending} onClick={() => mutate()} {...props}>
      Logout {isPending ? <Loader2 className="animate-spin" /> : <LogOut />}
    </Button>
  )
}
