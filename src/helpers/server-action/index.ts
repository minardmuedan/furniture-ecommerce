import 'server-only'

import { flattenError, ZodError } from 'zod'
import { RateLimit } from '@/lib/rate-limiter'

export default function createServerAction<TArgs extends unknown[]>(fn: (...fnArgs: TArgs) => Promise<undefined>) {
  return async (...args: TArgs) =>
    await fn(...args).catch(err => {
      if (err instanceof ZodError) return { success: false, type: 'validation_error', fields: flattenError(err).fieldErrors }
      if (err instanceof RateLimit) return { success: false, type: 'rate_limit', data: { remainingSeconds: err.remainingSeconds } }

      return { success: false, type: 'server_error', message: 'Something went wrong' }
    })
}
