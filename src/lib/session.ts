import { createSessionDb, deleteSessionDb, getSessionWithUserDb, updateSessionDb } from '@/database/models/sessions'
import { cache } from 'react'
import { generateSecureRandomString } from './auth'
import { deleteCookie, getCookie, getIpAddress, getUserAgent, setCookie } from './headers'

export const SESSION_COOKIE_KEY = 'session'
export const TEMP_SESSION_COOKIE_KEY = `temp-${SESSION_COOKIE_KEY}`
const MONTH_IN_MS = 1000 * 60 * 60 * 24 * 30

export const createSessionCookie = async (sessionId: string) => await setCookie(SESSION_COOKIE_KEY, sessionId, { maxAge: MONTH_IN_MS / 1000 })

export async function createSession(userId: string, opt?: { temporary: boolean }) {
  const id = generateSecureRandomString()
  const ipAddress = await getIpAddress()
  const userAgent = await getUserAgent()
  const expiresAt = new Date(Date.now() + MONTH_IN_MS)
  await createSessionDb({ id, userId, ipAddress, userAgent, expiresAt })
  if (opt?.temporary) await setCookie(TEMP_SESSION_COOKIE_KEY, id, { maxAge: 60 * 15 })
  else await createSessionCookie(id)
}

export const getSession = cache(async () => {
  const sessionId = await getCookie(SESSION_COOKIE_KEY)
  if (!sessionId) return { session: null }

  const session = await getSessionWithUserDb(sessionId)
  if (!session || !session.user.emailVerified) {
    await deleteCookie(SESSION_COOKIE_KEY).catch(() => {})
    return { session: null }
  }

  const now = Date.now()
  if (now > session.expiresAt.getTime()) {
    await deleteSessionDb(sessionId)
    await deleteCookie(SESSION_COOKIE_KEY).catch(() => {})
    return { session: null }
  }

  const isSessionHalfMonth = MONTH_IN_MS / 2 + now > session.expiresAt.getTime()
  if (isSessionHalfMonth) {
    await setCookie(SESSION_COOKIE_KEY, session.id, { maxAge: MONTH_IN_MS / 1000 }).catch(() => {})
    await updateSessionDb(sessionId, { expiresAt: new Date(now + MONTH_IN_MS) })
  }

  return { session }
})

export async function deleteSession() {
  const sessionId = await getCookie(SESSION_COOKIE_KEY)
  if (!sessionId) return

  await deleteSessionDb(sessionId)
  await deleteCookie(SESSION_COOKIE_KEY)
}
