import { headers } from 'next/headers'

import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies'
import { cookies } from 'next/headers'

// cookie

export type CookieOption = Omit<Partial<ResponseCookie>, 'name' | 'value' | 'sameSite' | 'httpOnly' | 'secure'>

const DEFAULT_SECURED_COOKIE_OPTION = { path: '/', httpOnly: true, sameSite: 'strict', secure: process.env.NODE_ENV === 'production' } as const
export async function setCookie(key: string, value: string, option?: CookieOption) {
  const cookieStore = await cookies()
  cookieStore.set(key, value, { ...DEFAULT_SECURED_COOKIE_OPTION, ...option })
}

export const getCookie = async (key: string) => (await cookies()).get(key)?.value

export const deleteCookie = async (key: string) => (await cookies()).delete(key)

// users

export const getIpAddress = async () => {
  const headersStore = await headers()
  const forwardedFor = headersStore.get('x-forwarded-for')
  const ipAddress = (forwardedFor ? forwardedFor.split(',')[0].trim() : headersStore.get('x-real-ip')) ?? null
  if (!ipAddress) throw 'No valid IP Address'
  return ipAddress
}

export async function getUserAgent() {
  const headerStore = await headers()
  return headerStore.get('user-agent')
}
