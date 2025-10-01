import { headers } from 'next/headers'

export const getIpAddress = async () => {
  const headersStore = await headers()
  const forwardedFor = headersStore.get('x-forwarded-for')
  const ipAddress = (forwardedFor ? forwardedFor.split(',')[0].trim() : headersStore.get('x-real-ip')) ?? null
  if (!ipAddress) throw 'No valid IP Address'
  return ipAddress
}
