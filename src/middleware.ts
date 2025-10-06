import { NextRequest, NextResponse } from 'next/server'

const GUEST_PATH = ['/login', '/signup', '/forgot-password']
const AUTH_PATH = ['/profile']

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const isAuthenticated = !!req.cookies.get('session')?.value

  const isGuestPath = GUEST_PATH.some(path => pathname.startsWith(path))
  if (isGuestPath && isAuthenticated) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  return NextResponse.next()
}

export const config = { matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'] }
