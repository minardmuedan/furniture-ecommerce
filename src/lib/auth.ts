import 'server-only'
import bcrypt from 'bcryptjs'
import { JWTPayload, jwtVerify, SignJWT } from 'jose'
import { JWTExpired, JWTInvalid } from 'jose/errors'

export function generateSecureRandomString(length = 24) {
  const alphabet = 'abcdefghijkmnpqrstuvwxyz23456789'

  const bytes = new Uint8Array(length)
  crypto.getRandomValues(bytes)

  let id = ''
  for (let i = 0; i < bytes.length; i++) {
    id += alphabet[bytes[i] >> 3]
  }
  return id
}

// bcrypt

export const hashPassword = async (password: string) => await bcrypt.hash(password, 10)
export const verifyPassword = async (password: string, hashedPassword: string) => await bcrypt.compare(password, hashedPassword)

// jwt

const JWT_KEY = new TextEncoder().encode(process.env.JWT_KEY)

export async function signJWT(payload: JWTPayload, expiresInMinute?: number) {
  const jwt = new SignJWT(payload).setProtectedHeader({ alg: 'HS256' })
  if (expiresInMinute) jwt.setExpirationTime(`${expiresInMinute}m`)
  return jwt.sign(JWT_KEY)
}

export async function verifyJWT<T>(jwt: string): Promise<{ payload: T | null; reason?: 'expired' | 'invalid' | 'unknown' }> {
  return await jwtVerify<T>(jwt, JWT_KEY, { algorithms: ['HS256'] }).catch(err => {
    if (err instanceof JWTExpired) return { payload: err.payload as T, reason: 'expired' }
    if (err instanceof JWTInvalid) return { payload: null, reason: 'invalid' }
    return { payload: null, reason: 'unknown' }
  })
}
