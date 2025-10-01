import { createSessionDb, deleteSessionDb, getSessionWithUserDb, updateSessionDb } from '@/database/models/sessions'
import { cache } from 'react'
import { generateSecureRandomString } from './auth'
import { deleteCookie, getCookie, getIpAddress, getUserAgent, setCookie } from './headers'

const COOKIE_KEY = 'session'
const MONTH_IN_MS = 60 * 60 * 24 * 30

export async function createSession(userId: string) {
  const id = generateSecureRandomString()
  const ipAddress = await getIpAddress()
  const userAgent = await getUserAgent()
  const expiresAt = new Date(Date.now() + MONTH_IN_MS)
  await createSessionDb({ id, userId, ipAddress, userAgent, expiresAt })
  await setCookie(COOKIE_KEY, id, { maxAge: MONTH_IN_MS * 1000 })
}

export const getSession = cache(async () => {
  const sessionId = await getCookie(COOKIE_KEY)
  if (!sessionId) return null

  const session = await getSessionWithUserDb(sessionId)
  if (!session || !session.user.emailVerified) return null

  const now = Date.now()
  if (now > session.expiresAt.getTime()) {
    await deleteSessionDb(sessionId)
    await deleteCookie(COOKIE_KEY).catch(() => {})
    return null
  }

  const isSessionHalfMonth = MONTH_IN_MS / 2 + now > session.expiresAt.getTime()
  if (isSessionHalfMonth) {
    await setCookie(COOKIE_KEY, session.id, { maxAge: MONTH_IN_MS * 1000 }).catch(() => {})
    await updateSessionDb(sessionId, { expiresAt: new Date(now + MONTH_IN_MS) })
  }

  return session
})

export async function deleteSession() {
  const sessionId = await getCookie(COOKIE_KEY)
  if (!sessionId) return

  await deleteSessionDb(sessionId)
  await deleteCookie(COOKIE_KEY)
}
