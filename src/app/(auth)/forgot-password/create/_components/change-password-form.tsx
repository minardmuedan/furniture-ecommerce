'use client'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { changePasswordAction } from '../_actions/change-password-action'
import { CreatePassword, createPasswordSchema } from '../_password-schema'

export default function ChangePasswordForm({ token }: { token: string }) {
  const router = useRouter()

  const form = useForm<CreatePassword>({
    resolver: zodResolver(createPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  })

  const formFields = [
    { name: 'password', label: 'Password', type: 'password', placeholder: '********' },
    { name: 'confirmPassword', label: 'Confirm Password', type: 'password', placeholder: '********' },
  ] as const

  async function onSubmit(values: CreatePassword) {
    const action = await changePasswordAction(token, values)
    if (action.success) {
      toast.success(action.message)
      return router.replace('/login')
    }
    if (action.type === 'custom_error') {
      toast.error(action.message)
      router.replace('/forgot-password')
    }
    if (action.type === 'server_error') form.setError('root', { message: action.message })
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

      <Button type="submit" disabled={form.formState.isSubmitting} className="w-full">
        Change Password
      </Button>
    </Form>
  )
}
