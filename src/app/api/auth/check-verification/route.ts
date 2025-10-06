import { getSessionWithUserDb } from '@/database/models/sessions'
import { deleteCookie, getCookie, setCookie } from '@/lib/headers'
import { createSessionCookie, SESSION_COOKIE_KEY, TEMP_SESSION_COOKIE_KEY } from '@/lib/session'
import { NextResponse } from 'next/server'

export async function GET() {
  const sessionId = (await getCookie(SESSION_COOKIE_KEY)) || (await getCookie(TEMP_SESSION_COOKIE_KEY))
  if (!sessionId) return NextResponse.json({ continue: false, success: false, message: 'User session not found' })

  const session = await getSessionWithUserDb(sessionId)
  if (!session) {
    await deleteCookie(TEMP_SESSION_COOKIE_KEY)
    return NextResponse.json({ continue: false, success: false, message: 'User session not found' })
  }

  if (!session.user.emailVerified) {
    await setCookie(TEMP_SESSION_COOKIE_KEY, sessionId, { maxAge: 60 * 15 })
    return NextResponse.json({ continue: true })
  }

  await deleteCookie('signup')
  await deleteCookie(TEMP_SESSION_COOKIE_KEY)
  await createSessionCookie(session.id)

  return NextResponse.json({ continue: false, success: true, message: `Email verified successful — welcome, ${session.user.username}` })
}
