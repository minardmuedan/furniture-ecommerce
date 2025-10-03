import z from 'zod'
import { emailSchema } from '../_auth-schema'

export const forgotPasswordSchema = z.object({
  email: emailSchema,
})

export type ForgotPassword = z.infer<typeof forgotPasswordSchema>
