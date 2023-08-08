'use client'

import { ReloadIcon } from '@radix-ui/react-icons'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type * as z from 'zod'

import { ReactHookForm } from '@/common/react-hook-form'
import type { loginSchema } from '@/common/schemas'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import type { Database } from '@/lib/database.types'

import { Button } from '../ui/button'
import { Input } from '../ui/input'

export const LoginForm = () => {
  const router = useRouter()
  const supabase = createClientComponentClient<Database>()
  const [isLoading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const { onHandleLoginForm } = ReactHookForm()

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    setLoading(true)
    const { email, password } = values

    try {
      // ログイン
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      // エラーチェック
      if (error) {
        setMessage('エラーが発生しました。' + error.message)
        return
      }

      // トップページに遷移
      router.push('/')
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
      <Form {...onHandleLoginForm}>
        <form
          onSubmit={onHandleLoginForm.handleSubmit(onSubmit)}
          className='flex flex-col space-y-5 rounded bg-white p-5 shadow-lg'
        >
          <FormField
            control={onHandleLoginForm.control}
            name='email'
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>メールアドレス</FormLabel>
                  <FormControl>
                    <Input type='email' placeholder='mail@example.com' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )
            }}
          />
          <FormField
            control={onHandleLoginForm.control}
            name='password'
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>パスワード</FormLabel>
                  <FormControl>
                    <Input type='password' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )
            }}
          />
          <div className='flex justify-start pt-2'>
            <Button type='submit' variant='outline' disabled={isLoading}>
              {isLoading && <ReloadIcon className='mr-2 h-4 w-4 animate-spin' />}
              {isLoading ? 'ログイン中' : 'ログイン'}
            </Button>
          </div>
        </form>
      </Form>

      {message && <div className='my-5 text-center text-sm text-red-500'>{message}</div>}
    </div>
  )
}
