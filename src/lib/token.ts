import { generateSecureRandomString, signJWT, verifyJWT } from './auth'

const EXPIRES_IN_MINUTE = 30

export async function generateToken() {
  const token = generateSecureRandomString()
  const jwtToken = await signJWT({ token }, EXPIRES_IN_MINUTE)
  return { token, jwtToken }
}

export async function getToken(jwtToken: string) {
  const { payload, reason } = await verifyJWT<{ token: string }>(jwtToken)
  if (!payload) return null
  return { token: payload.token, reason }
}
