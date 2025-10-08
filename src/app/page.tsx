'use client'

import { Button, ButtonLink } from '@/components/ui/button'
import { toast } from 'sonner'

export default function Homepage() {
  return (
    <div>
      <ButtonLink href="/admin">Dashboard</ButtonLink>

      <Button onClick={() => toast.success('sucess euhehe')}>Toasts </Button>
    </div>
  )
}
