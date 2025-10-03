import z from 'zod'
import { emailSchema } from '../_auth-schema'

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
})

export type Login = z.infer<typeof loginSchema>
