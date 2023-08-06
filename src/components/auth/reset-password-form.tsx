'use client'

import { ReloadIcon } from '@radix-ui/react-icons'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type * as z from 'zod'

import { ReactHookForm } from '@/common/react-hook-form'
import type { emailSchema } from '@/common/schemas'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import type { Database } from '@/lib/database.types'

import { Button } from '../ui/button'
import { Input } from '../ui/input'

export const ResetPasswordForm = () => {
  const router = useRouter()
  const supabase = createClientComponentClient<Database>()
  const [isLoading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const { onHandleResetPasswordForm } = ReactHookForm()

  // 送信
  const onSubmit = async (values: z.infer<typeof emailSchema>) => {
    setLoading(true)
    const { email } = values

    try {
      // パスワードリセットメールを送信
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${location.origin}/auth/reset-password/confirm`,
      })

      // エラーチェック
      if (error) {
        setMessage('エラーが発生しました。' + error.message)
        return
      }

      setMessage('パスワードリセットに必要なメールを送信しました。')
    } catch (error) {
      setMessage('エラーが発生しました。' + error)
      return
    } finally {
      setLoading(false)
      router.refresh()
    }
  }
  return (
    <div>
      <Form {...onHandleResetPasswordForm}>
        <form
          onSubmit={onHandleResetPasswordForm.handleSubmit(onSubmit)}
          className='flex flex-col space-y-3 rounded-lg border p-5'
        >
          <FormField
            control={onHandleResetPasswordForm.control}
            name='email'
            render={({ field }) => {
              return (
                <FormItem>
                  <FormControl>
                    <Input placeholder='メールアドレス' type='email' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )
            }}
          />
          <div className='flex justify-end'>
            <Button type='submit' variant='default' disabled={isLoading}>
              {isLoading && <ReloadIcon className='mr-2 h-4 w-4 animate-spin' />}
              {isLoading ? '送信中' : '送信'}
            </Button>
          </div>
        </form>
      </Form>
      {message && <div className='my-5 text-center text-sm text-red-500'>{message}</div>}
      <div className='mt-5 flex flex-col space-y-3 rounded-lg border p-5 text-center'>
        <Link href='/auth/login' className=''>
          ログインはこちら
        </Link>
      </div>
    </div>
  )
}
