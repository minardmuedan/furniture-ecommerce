import 'server-only'

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
