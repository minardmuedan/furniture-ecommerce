import { createMemoryRateLimiter, disallow, RateLimit } from '@/lib/rate-limiter'
import createServerAction from '.'
import { ActionSuccess } from './type'
import { getIpAddress, setCookie } from '@/lib/headers'

type RateLimitParams = {
  key: string
  identifier?: string
  maxAttempts?: number
  refill?: {
    refilledAttempt: number
    perSeconds: number
  }
  withCookie?: boolean
}

export function createServerActionWithRateLimiter<TArgs extends unknown[]>(
  fn: (attempt: number, ...fnArgs: TArgs) => Promise<ActionSuccess>,
  { key, identifier, maxAttempts, refill, withCookie }: RateLimitParams,
) {
  const rateLimiter = createMemoryRateLimiter(maxAttempts, refill)

  return createServerAction(async (...args: TArgs) => {
    const rateLimitId = identifier ?? (await getIpAddress())

    const { record, refillPerMs } = await rateLimiter(`${key}.${rateLimitId}`)

    return await fn(record.attempt, ...args).finally(async () => {
      if (record.attempt <= 0) {
        if (withCookie) {
          const now = Date.now()
          const nextSubmt = record.lastUsed + refillPerMs
          await setCookie(key, `${nextSubmt}`, { maxAge: Math.ceil((nextSubmt - now) / 1000) })
        }
        disallow(record, refillPerMs)
      }
    })
  })
}
