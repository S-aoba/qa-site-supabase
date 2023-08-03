'use client'

import { ReloadIcon } from '@radix-ui/react-icons'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type * as z from 'zod'

import { ReactHookForm } from '@/common/react-hook-form'
import type { signupSchema } from '@/common/schemas'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import type { Database } from '@/lib/database.types'

import { Button } from '../ui/button'
import { Input } from '../ui/input'

export const SignupForm = () => {
  const router = useRouter()
  const supabase = createClientComponentClient<Database>()
  const [isLoading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const { onHandleSignupForm } = ReactHookForm()
  // 送信
  const onSubmit = async (values: z.infer<typeof signupSchema>) => {
    setLoading(true)
    const { username, email, password } = values

    try {
      // サインアップ
      const { error: errorSignup } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${location.origin}/auth/callback`,
        },
      })

      // エラーチェック
      if (errorSignup) {
        setMessage('エラーが発生しました。' + errorSignup.message)
        return
      }
      // プロフィールの名前を更新
      const { error: updateError } = await supabase.from('profiles').update({ username }).eq('email', email)

      // エラーチェック
      if (updateError) {
        setMessage('エラーが発生しました。' + updateError.message)
        return
      }

      setMessage(
        '本登録用のURLを記載したメールを送信しました。メールをご確認の上、メール本文中のURLをクリックして、本登録を行ってください。'
      )
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
      <Form {...onHandleSignupForm}>
        <form
          onSubmit={onHandleSignupForm.handleSubmit(onSubmit)}
          className='flex flex-col space-y-3 rounded-lg border border-solid border-slate-300 bg-[#f6f8fa] p-5'
        >
          <FormField
            control={onHandleSignupForm.control}
            name='username'
            render={({ field }) => {
              return (
                <FormItem>
                  <FormControl>
                    <Input placeholder='ユーザーネーム' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )
            }}
          />
          <FormField
            control={onHandleSignupForm.control}
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
            control={onHandleSignupForm.control}
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
            <Button type='submit' variant='default' disabled={isLoading}>
              {isLoading && <ReloadIcon className='mr-2 h-4 w-4 animate-spin' />}
              {isLoading ? '新規登録中' : '新規登録'}
            </Button>
          </div>
        </form>
      </Form>

      {message && <div className='my-5 text-center text-sm text-red-500'>{message}</div>}

      <div className='mt-5 flex items-center  space-x-2 rounded-lg border border-solid border-slate-300 p-5 text-sm'>
        <span>既にアカウントはお持ちですか?</span>
        <Link href='/auth/login' className='font-bold text-slate-500 hover:text-slate-600'>
          ログインはこちら
        </Link>
      </div>
    </div>
  )
}
