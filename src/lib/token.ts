import { generateSecureRandomString, signJWT, verifyJWT } from './auth'

const DB_TOKEN_EXPIRES_IN_MINUTE = 15
const JWT_TOKEN_EXPIRES_IN_MINUTE = 30

export async function generateToken() {
  const expiresAt = new Date(Date.now() + 60_000 * DB_TOKEN_EXPIRES_IN_MINUTE)
  const token = generateSecureRandomString()
  const jwtToken = await signJWT({ token }, JWT_TOKEN_EXPIRES_IN_MINUTE)
  return { token, jwtToken, expiresAt }
}

export async function getToken(jwtToken: string) {
  const { payload, reason } = await verifyJWT<{ token: string }>(jwtToken)
  if (!payload) return null
  return { token: payload.token, reason }
}
