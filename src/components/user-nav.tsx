import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { ClientAuthUser, useLogout } from '@/hooks/use-auth'
import { LogOut, User2 } from 'lucide-react'
import Image from 'next/image'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Spinner } from './ui/spinner'
import Link from 'next/link'

export default function UserNav({ user }: { user: ClientAuthUser }) {
  const { logout, isLogouting } = useLogout()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="cursor-pointer">
        <Avatar className="size-10 p-0.5">
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
        <DropdownMenuItem asChild>
          <Link href="/profile">
            <User2 /> Profile
          </Link>
        </DropdownMenuItem>
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
