import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { ClientAuthUser, useLogout } from '@/hooks/use-auth'
import { LogOut } from 'lucide-react'
import Image from 'next/image'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Spinner } from './ui/spinner'

export default function UserNav({ user }: { user: ClientAuthUser }) {
  const { logout, isLogouting } = useLogout()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="cursor-pointer">
        <Avatar className="size-10">
          {user.avatarSrc && (
            <AvatarImage asChild>
              <Image src={user.avatarSrc} alt="user avatar" width={40} height={40} />
            </AvatarImage>
          )}
          <AvatarFallback>{user.username.slice(0, 2)}</AvatarFallback>
        </Avatar>

        <span className="sr-only">open user nav</span>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Billing</DropdownMenuItem>
        <DropdownMenuItem>Team</DropdownMenuItem>
        <DropdownMenuItem>Subscription</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" disabled={isLogouting} onClick={() => logout()}>
          {isLogouting ? <Spinner /> : <LogOut />} Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
