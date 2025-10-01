import { ZodError } from 'zod'

type ThrowError = { type: 'custom_error'; message: string } | { type: 'validation_error'; fields: Record<string, string> }

export class CustomError {
  type = 'custom_error' as const
  message: string
  constructor(message: string) {
    this.message = message
  }
}

export function error(err: ThrowError) {
  if (err.type === 'validation_error') {
    throw new ZodError(Object.entries(err.fields).map(([path, message]) => ({ code: 'custom', path: [path], message })))
  }

  throw new CustomError(err.message)
}
