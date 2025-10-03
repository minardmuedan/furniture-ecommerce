import { deleteCookie } from '@/lib/headers'
import { getSession } from '@/lib/session'
import { NextResponse } from 'next/server'

export async function GET() {
  const { session, reason } = await getSession()
  if (reason === 'unverified_email') return NextResponse.json({ continue: true })

  await deleteCookie('signup')
  if (!session) return NextResponse.json({ continue: false, success: false, message: 'User session not found' })
  return NextResponse.json({ continue: false, success: true, message: `Email verified successful — welcome, ${session.user.username}` })
}
