import { usePathname } from 'next/navigation'

export function useIsActivePath() {
  const pathname = usePathname()
  return {
    pathname,
    isActivePath: (path: string) => pathname === path,
  }
}
