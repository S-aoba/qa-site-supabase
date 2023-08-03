'use client'

import { ReloadIcon } from '@radix-ui/react-icons'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type * as z from 'zod'

import { ReactHookForm } from '@/common/react-hook-form'
import type { passwordSchema } from '@/common/schemas'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import type { Database } from '@/lib/database.types'

import { Button } from '../ui/button'
import { Input } from '../ui/input'

export const ResetPasswordCombineForm = () => {
  const router = useRouter()
  const supabase = createClientComponentClient<Database>()
  const [isLoading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const { onHandleResetPasswordConfirmForm } = ReactHookForm()

  const onSubmit = async (values: z.infer<typeof passwordSchema>) => {
    setLoading(true)
    setMessage('')
    const { password } = values

    try {
      // パスワードの更新
      const { error } = await supabase.auth.updateUser({
        password,
      })

      if (error) {
        setMessage('エラーが発生しました。' + error.message)
        return
      }

      setMessage('パスワードは正常に更新されました。')
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
      <div className='mb-10 text-center text-xl font-bold'>パスワード変更</div>
      <Form {...onHandleResetPasswordConfirmForm}>
        <form
          onSubmit={onHandleResetPasswordConfirmForm.handleSubmit(onSubmit)}
          className='flex flex-col space-y-3 rounded-lg border border-solid border-slate-300 bg-[#f6f8fa] p-5'
        >
          <FormField
            control={onHandleResetPasswordConfirmForm.control}
            name='password'
            render={({ field }) => {
              return (
                <FormItem>
                  <FormControl>
                    <Input placeholder='パスワード' type='password' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )
            }}
          />
          <FormField
            control={onHandleResetPasswordConfirmForm.control}
            name='confirmation'
            render={({ field }) => {
              return (
                <FormItem>
                  <FormControl>
                    <Input placeholder='確認用パスワード' type='password' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )
            }}
          />
          <div className='flex justify-end'>
            <Button type='submit' variant='default' disabled={isLoading}>
              {isLoading && <ReloadIcon className='mr-2 h-4 w-4 animate-spin' />}
              {isLoading ? '更新中' : '更新'}
            </Button>
          </div>

          {message && <div className='pt-3 text-center text-sm text-red-500'>{message}</div>}
        </form>
      </Form>
    </div>
  )
}
