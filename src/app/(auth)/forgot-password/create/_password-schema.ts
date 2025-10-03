import z from 'zod'
import { passwordSchema } from '../../_auth-schema'

export const createPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Confirm your password'),
  })
  .refine(data => data.password === data.confirmPassword, { path: ['confirmPassword'], message: 'Password do not match' })

export type CreatePassword = z.infer<typeof createPasswordSchema>
