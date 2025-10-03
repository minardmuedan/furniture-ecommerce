import { Button } from '@/components/ui/button'
import { headers } from 'next/headers'

export default function Homepage() {
  return (
    <div>
      <form
        action={async () => {
          'use server'

          const headerStore = await headers()

          console.log(JSON.stringify(headerStore, null, 2))
        }}
      >
        <Button>hello</Button>
      </form>
    </div>
  )
}
