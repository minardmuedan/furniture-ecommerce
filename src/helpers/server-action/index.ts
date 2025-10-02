import 'server-only'

import { flattenError, ZodError } from 'zod'
import { RateLimit } from '@/lib/rate-limiter'
import { ActionError, ActionSuccess } from './type'
import { isRedirectError } from 'next/dist/client/components/redirect-error'

export default function createServerAction<TArgs extends unknown[]>(fn: (...fnArgs: TArgs) => Promise<ActionSuccess>) {
  return async (...args: TArgs): Promise<ActionSuccess | ActionError> =>
    await fn(...args).catch(err => {
      if (isRedirectError(err)) throw err
      if (err instanceof ZodError) return { success: false, type: 'validation_error', fields: flattenError(err).fieldErrors }
      if (err instanceof RateLimit) return { success: false, type: 'rate_limit', data: { nextSubmit: err.nextSubmit } }
      if (err instanceof CustomError) return { success: false, ...err }

      console.log('ERROR IN SERVER ACTION: ', err)
      return { success: false, type: 'server_error', message: 'Something went wrong' }
    })
}

export function error(err: { type: 'custom_error'; message: string } | { type: 'validation_error'; fields: Record<string, string> }): never {
  if (err.type === 'validation_error') {
    throw new ZodError(Object.entries(err.fields).map(([path, message]) => ({ code: 'custom', path: [path], message })))
  }

  throw new CustomError(err.message)
}

class CustomError {
  type = 'custom_error' as const
  message: string
  constructor(message: string) {
    this.message = message
  }
}
