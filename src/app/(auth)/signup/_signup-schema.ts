import z from 'zod'
import { emailSchema, passwordSchema } from '../_auth-schema'

export const signupSchema = z
  .object({
    username: z.string().min(1, 'Username is required').max(15, 'Must be at most 15 characters'),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Confirm your password'),
  })
  .refine(data => data.password === data.confirmPassword, { path: ['confirmPassword'], message: 'Password do not match' })

export type Signup = z.infer<typeof signupSchema>
