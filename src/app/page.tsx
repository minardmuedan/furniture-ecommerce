import { Button } from '@/components/ui/button'

export default function Home() {
  const title = 'Dining Room'
  return (
    <div>
      <p>{JSON.stringify({ data: title.split(' ').join('-').toLowerCase() })}</p>
      <div>home</div>
      <Button>Hello</Button>
    </div>
  )
}
