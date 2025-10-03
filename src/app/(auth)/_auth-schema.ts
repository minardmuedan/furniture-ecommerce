import z from 'zod'

export const emailSchema = z.email('Enter a valid email address')

export const passwordSchema = z
  .string()
  .min(6, 'Password must be at least 6 characters')
  .max(64, 'Password must be at most 64 characters')
  .regex(/[a-zA-Z]/, 'Password must contain a letter')
  .regex(/[0-9]/, 'Password must contain a number')
