import { getSession } from '@/lib/session'
import { NextResponse } from 'next/server'

export async function GET() {
  const { session } = await getSession()
  if (!session) return NextResponse.json(null)

  const { username, email, avatarSrc, isAdmin, createdAt } = session.user

  const user = { username, email, avatarSrc, createdAt, isAdmin: isAdmin ?? undefined }
  return NextResponse.json(user)
}
