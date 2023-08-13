'use client'

import { ReloadIcon } from '@radix-ui/react-icons'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type * as z from 'zod'

import { ReactHookForm } from '@/common/react-hook-form'
import type { passwordSchema } from '@/common/schemas'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import type { Database } from '@/lib/database.types'

import { Button } from '../ui/button'
import { Input } from '../ui/input'

// パスワード変更
export const Password = () => {
  const router = useRouter()
  const supabase = createClientComponentClient<Database>()
  const [isLoading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const { onHandlePasswordForm } = ReactHookForm()
  // 送信
  const onSubmit = async (values: z.infer<typeof passwordSchema>) => {
    setLoading(true)
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
    <div className='flex w-full flex-col items-center'>
      <div className='w-full max-w-[800px] rounded border border-input bg-background p-3 shadow dark:shadow-input'>
        <div className='mb-10 text-center dark:brightness-75'>パスワード変更</div>
        <Form {...onHandlePasswordForm}>
          <form onSubmit={onHandlePasswordForm.handleSubmit(onSubmit)}>
            <FormField
              control={onHandlePasswordForm.control}
              name='password'
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel className='dark:brightness-75'>新しいパスワード</FormLabel>
                    <FormControl>
                      <Input placeholder='パスワード' type='password' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )
              }}
            />
            <FormField
              control={onHandlePasswordForm.control}
              name='confirmation'
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel className='dark:brightness-75'>確認用パスワード</FormLabel>
                    <FormControl>
                      <Input placeholder='確認用パスワード' type='password' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )
              }}
            />
            <div className='mb-2 mt-5'>
              <Button type='submit' variant='default' disabled={isLoading}>
                {isLoading && <ReloadIcon className='mr-2 h-4 w-4 animate-spin' />}
                {isLoading ? '変更中' : '変更'}
              </Button>
            </div>
            {message && <div className='text-center text-sm text-red-500'>{message}</div>}
          </form>
        </Form>
      </div>
    </div>
  )
}
