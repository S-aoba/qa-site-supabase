'use client'

import { ReloadIcon } from '@radix-ui/react-icons'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type * as z from 'zod'

import { ReactHookForm } from '@/common/react-hook-form'
import type { loginSchema } from '@/common/schemas'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import type { Database } from '@/lib/database.types'

import { Button } from '../ui/button'
import { Input } from '../ui/input'

export const LoginForm = () => {
  const router = useRouter()
  const supabase = createClientComponentClient<Database>()
  const [isLoading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const { onHandleLoginForm } = ReactHookForm()

  // 送信
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
          className='flex flex-col space-y-3 rounded-lg border border-solid border-slate-300 bg-[#f6f8fa] p-5'
        >
          <FormField
            control={onHandleLoginForm.control}
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
          <FormField
            control={onHandleLoginForm.control}
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
          <div className='flex justify-end'>
            <Button type='submit' variant='outline' disabled={isLoading}>
              {isLoading && <ReloadIcon className='mr-2 h-4 w-4 animate-spin' />}
              {isLoading ? 'ログイン中' : 'ログイン'}
            </Button>
          </div>
        </form>
      </Form>

      {message && <div className='my-5 text-center text-sm text-red-500'>{message}</div>}

      <div className='mt-5 flex flex-col space-y-3 rounded-lg border border-solid border-slate-300 p-5 text-center text-sm'>
        <Link href='/auth/reset-password' className='font-bold text-slate-500 hover:text-slate-600'>
          パスワードを忘れた方はこちら
        </Link>
        <Link href='/auth/signup' className='font-bold text-slate-500 hover:text-slate-600'>
          アカウントを作成する
        </Link>
      </div>
    </div>
  )
}
