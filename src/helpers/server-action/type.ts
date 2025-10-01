type ServerError = { type: 'server_error'; message: string }
type CustomError = { type: 'custom_error'; message: string }
type RateLimitError = { type: 'rate_limit'; data: { remainingSeconds: number } }
type ValidationError = { type: 'validation_error'; fields: Record<string, string[]> }
export type ActionError = { success: false } & (CustomError | ValidationError | RateLimitError | ServerError)

export type ActionSuccess = { success: true; message?: string; redirectTo?: string }
