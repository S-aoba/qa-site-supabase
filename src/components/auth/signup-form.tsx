'use client'

import { ReloadIcon } from '@radix-ui/react-icons'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type * as z from 'zod'

import { ReactHookForm } from '@/common/react-hook-form'
import type { signupSchema } from '@/common/schemas'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
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
    <div className='space-y-10'>
      <div className='text-center'>
        <h1 className='text-2xl'>Signup</h1>
      </div>
      <div>
        <Form {...onHandleSignupForm}>
          <form
            onSubmit={onHandleSignupForm.handleSubmit(onSubmit)}
            className='flex flex-col space-y-5 rounded bg-white p-5 shadow-lg'
          >
            <FormField
              control={onHandleSignupForm.control}
              name='username'
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>ユーザーネーム</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                    <FormLabel>メールアドレス</FormLabel>
                    <FormControl>
                      <Input placeholder='mail@example.com' type='email' {...field} />
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
              <Button type='submit' variant='default' disabled={isLoading}>
                {isLoading && <ReloadIcon className='mr-2 h-4 w-4 animate-spin' />}
                {isLoading ? '新規登録中' : '新規登録'}
              </Button>
            </div>
          </form>
        </Form>

        {message && <div className='my-5 text-center text-sm text-red-500'>{message}</div>}
      </div>
      <div className='flex items-center justify-center space-x-3 rounded bg-white p-5 text-sm shadow-lg'>
        <span className='text-muted-foreground'>既にアカウントはお持ちですか?</span>
        <Link href='/auth/login' className='text-muted-foreground hover:text-black'>
          ログインはこちら
        </Link>
      </div>
    </div>
  )
}
