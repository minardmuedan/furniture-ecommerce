'use client'

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import RateLimitButton from '../_ratelimit-button'
import { useRateLimitContext } from '../_ratelimit-provider'
import { signupAction } from './_signup-action'
import { signupSchema, type Signup } from './_signup-schema'

export default function SignupForm() {
  const { setNextSubmit } = useRateLimitContext('signup')

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

  async function onSubmit(values: Signup) {
    const action = await signupAction(values)
    if (!action.success) {
      if (action.type === 'validation_error') {
        return Object.entries(action.fields).map(([key, error]) => {
          form.setError(key as keyof Signup, { message: error[0] }, { shouldFocus: true })
        })
      }

      if (action.type === 'rate_limit') return setNextSubmit(action.data.nextSubmit)

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

      <RateLimitButton auth="signup" type="submit" disabled={form.formState.isSubmitting} className="w-full">
        Sign Up
      </RateLimitButton>
    </Form>
  )
}
