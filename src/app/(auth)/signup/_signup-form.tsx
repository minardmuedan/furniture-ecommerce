'use client'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import useCountDown from '@/hooks/use-countdown'
import useIsHydrated from '@/hooks/use-hydrated'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { signupSchema, type Signup } from './_schema'
import { signupAction } from './_action'

export default function SignupForm({ rateLimitDate }: { rateLimitDate: number }) {
  const isHydrated = useIsHydrated()
  const { timer, setTimer } = useCountDown()

  const form = useForm<Signup>({
    resolver: zodResolver(signupSchema),
    defaultValues: { username: '', email: '', password: '', confirmPassword: '' },
  })

  const formFields = [
    { name: 'username', label: 'Username', type: 'text', placeholder: 'minard' },
    { name: 'email', label: 'Email ', type: 'email', placeholder: 'minard@example.com' },
    { name: 'password', label: 'Password', type: 'password', placeholder: '********' },
    { name: 'confirmPassword', label: 'Confirm Password', type: 'password', placeholder: '********' },
  ] as const

  useEffect(() => {
    if (rateLimitDate) setTimer(Math.ceil((rateLimitDate - Date.now()) / 1000))
  }, [])

  async function onSubmit(values: Signup) {
    const action = await signupAction(values)
    if (!action.success) {
      if (action.type === 'validation_error') {
        return Object.entries(action.fields).map(([key, error]) => {
          form.setError(key as keyof Signup, { message: error[0] }, { shouldFocus: true })
        })
      }

      if (action.type === 'rate_limit') return setTimer(action.data.remainingSeconds)

      form.setError('root', { message: action.message })
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

      <Button type="submit" disabled={!isHydrated || timer > 0} className="w-full">
        {timer > 0 ? `try again after ${timer} second/s` : 'Sign Up'}
      </Button>
    </Form>
  )
}
