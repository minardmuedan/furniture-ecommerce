'use client'

import { Button } from '@/components/ui/button'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

export default function ToggleTheme() {
  const { setTheme } = useTheme()
  return (
    <Button variant="ghost" size="icon" className="size-7" onClick={() => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))}>
      <Sun className="scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
      <Moon className="absolute scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
