import { getSession } from '@/lib/session'

export default async function Homepage() {
  const session = await getSession()
  return (
    <>
      <pre>{JSON.stringify({ session }, null, 2)}</pre>
    </>
  )
}
