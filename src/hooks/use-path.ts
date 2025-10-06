import { usePathname } from 'next/navigation'

export function useIsActivePath() {
  const pathname = usePathname()
  return (path: string) => pathname === path
}
