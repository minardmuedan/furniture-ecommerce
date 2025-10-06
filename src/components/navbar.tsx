'use client'

import LogoutButton from '@/app/(auth)/_logout/logout-button'
import { ButtonLink } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import { useIsActivePath } from '@/hooks/use-path'
import Image from 'next/image'
import Link from 'next/link'
import NavbarMenu from './nav-menu'
import { Skeleton } from './ui/skeleton'
import UserNav from './user-nav'

export default function Navbar() {
  const isActive = useIsActivePath()
  const { user, isGettingUser } = useAuth()

  return (
    <header className="user-header flex h-14 w-full items-center justify-between border-b px-5">
      <Link href="/" className={!isActive('/') ? 'opacity-75 transition-opacity ease-out hover:opacity-100' : 'opacity-100'}>
        <Image src="/plant-logo.svg" height={30} width={30} alt="plant logo" />
        <span className="sr-only">Home</span>
      </Link>

      <NavbarMenu />

      {isGettingUser ? <Skeleton className="h-9 w-[154.75px]" /> : user ? <UserNav user={user} /> : <GuestLink />}
    </header>
  )
}

function GuestLink() {
  return (
    <div className="flex gap-1">
      <>
        <ButtonLink href="/signup" variant="link" className="text-muted-foreground hover:text-foreground">
          Signup
        </ButtonLink>

        <ButtonLink href="/login">Login</ButtonLink>
      </>
    </div>
  )
}
