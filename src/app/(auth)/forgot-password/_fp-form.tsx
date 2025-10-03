'use client'

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import RateLimitButton from '../_ratelimit-button'
import { useRateLimitContext } from '../_ratelimit-provider'
import { forgotPasswordAction } from './_fp-action'
import { ForgotPassword, forgotPasswordSchema } from './_fp-schema'

export default function ForgotPasswordForm() {
  const router = useRouter()
  const { setNextSubmit, setNextSubmitOf } = useRateLimitContext('forgotPassword')

  const form = useForm<ForgotPassword>({ resolver: zodResolver(forgotPasswordSchema), defaultValues: { email: '' } })

  async function onSubmit(values: ForgotPassword) {
    const action = await forgotPasswordAction(values)
    if (!action.success) {
      if (action.type === 'validation_error') {
        const errMsg = action.fields.email[0]
        return form.setError('email', { message: errMsg }, { shouldFocus: true })
      }

      if (action.type === 'rate_limit') return setNextSubmit(action.data.nextSubmit)

      form.setError('root', { message: action.message })
    } else {
      setNextSubmitOf('resendPasswordVerification', Date.now() + 30_000)
      router.push('/forgot-password/verification')
    }
  }

  return (
    <Form formHook={form} onSubmit={form.handleSubmit(onSubmit)}>
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email Address</FormLabel>
            <FormControl>
              <Input placeholder="minard@example.com" type="email" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <RateLimitButton auth="forgotPassword" type="submit" disabled={form.formState.isSubmitting} className="w-full">
        Continue
      </RateLimitButton>
    </Form>
  )
}
