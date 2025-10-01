type ServerError = { type: 'server_error'; message: string }
type CustomError = { type: 'custom_error'; message: string }
type RateLimitError = { type: 'rate_limit'; data: { remainingSeconds: number } }
type ValidationError = { type: 'validation_error'; fields: Record<string, string[]> }
export type ActionError = CustomError | ValidationError | RateLimitError | ServerError

type Success = { message: string }
type SuccessWithRedirect = Success & { redirectTo: string }

export type ActionSuccess = Success | SuccessWithRedirect
