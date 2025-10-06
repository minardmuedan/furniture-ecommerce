'use client'

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import RateLimitButton from '../_ratelimit-button'
import { useRateLimitContext } from '../_ratelimit-provider'
import { Login, loginSchema } from './_login-schema'
import { loginAction } from './_login-action'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'

export default function LoginForm() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { setNextSubmit } = useRateLimitContext('login')

  const form = useForm<Login>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  async function onSubmit(values: Login) {
    const action = await loginAction(values)
    if (!action.success) {
      if (action.type === 'validation_error') {
        return Object.entries(action.fields).map(([key, error]) => {
          form.setError(key as keyof Login, { message: error[0] }, { shouldFocus: true })
        })
      }

      if (action.type === 'rate_limit') return setNextSubmit(action.data.nextSubmit)

      form.setError('root', { message: action.message })
    } else {
      queryClient.invalidateQueries({ queryKey: ['session'] })
      toast.success(action.message, { icon: '👋' })
      router.replace(action.redirectTo ?? '/')
    }
  }

  return (
    <Form formHook={form} onSubmit={form.handleSubmit(onSubmit)}>
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input type="email" placeholder="minard@example.com" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <div className="flex items-center justify-between">
              <FormLabel>Password</FormLabel>
              <Link tabIndex={-1} href="/forgot-password" className="hover:text-primary text-muted-foreground text-sm font-medium transition-colors">
                forgot password?
              </Link>
            </div>
            <FormControl>
              <Input type="password" placeholder="********" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <RateLimitButton auth="login" type="submit" disabled={form.formState.isSubmitting} className="w-full">
        Login
      </RateLimitButton>
    </Form>
  )
}
