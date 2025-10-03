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

export default function LoginForm() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { setNextSubmit } = useRateLimitContext('login')

  const form = useForm<Login>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const formFields = [
    { name: 'email', label: 'Email ', type: 'email', placeholder: 'minard@example.com' },
    { name: 'password', label: 'Password', type: 'password', placeholder: '********' },
  ] as const

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
      router.replace('/')
    }
  }

  return (
    <Form formHook={form} onSubmit={form.handleSubmit(onSubmit)}>
      {formFields.map(({ name, label, ...formfield }, i) => (
        <FormField
          key={i}
          control={form.control}
          name={name}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{label}</FormLabel>
              <FormControl>
                <Input {...formfield} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ))}

      <RateLimitButton auth="login" type="submit" disabled={form.formState.isSubmitting} className="w-full">
        Login
      </RateLimitButton>
    </Form>
  )
}
