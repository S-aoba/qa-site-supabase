'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { SubmitHandler } from 'react-hook-form'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import type { Database } from '@/lib/database.types'

import { Button } from '../ui/button'
import { Input } from '../ui/input'

export type SignupSchema = z.infer<typeof schema>

// 入力データの検証ルールを定義
const schema = z.object({
  username: z.string().min(2, { message: '2文字以上入力する必要があります。' }),
  email: z.string().email({ message: 'メールアドレスの形式ではありません。' }),
  password: z.string().min(6, { message: '6文字以上入力する必要があります。' }),
})
export const SignupForm = () => {
  const router = useRouter()
  const supabase = createClientComponentClient<Database>()
  const [isLoading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    // 初期値
    defaultValues: { username: '', email: '', password: '' },
    // 入力値の検証
    resolver: zodResolver(schema),
  })
  // 送信
  const onSubmit: SubmitHandler<SignupSchema> = async (data) => {
    setLoading(true)
    try {
      // サインアップ
      const { error: errorSignup } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
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
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ username: data.username })
        .eq('email', data.email)

      // エラーチェック
      if (updateError) {
        setMessage('エラーが発生しました。' + updateError.message)
        return
      }

      // 入力フォームクリア
      reset()
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
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='flex flex-col rounded-lg border border-solid border-slate-300 bg-[#f6f8fa] p-5'
      >
        <div>
          <Input
            id='username'
            type='text'
            placeholder='名前'
            autoComplete='username'
            {...register('username', { required: true })}
          />
          <div className='my-3 text-center text-sm text-red-500'>{errors.username?.message}</div>
        </div>
        <div>
          <Input
            id='email'
            type='email'
            placeholder='メールアドレス'
            autoComplete='email'
            {...register('email', { required: true })}
          />
          <div className='my-3 text-center text-sm text-red-500'>{errors.email?.message}</div>
        </div>

        <div>
          <Input
            id='password'
            type='password'
            placeholder='パスワード'
            autoComplete='current-password'
            {...register('password', { required: true })}
          />
          <div className='my-3 text-center text-sm text-red-500'>{errors.password?.message}</div>
        </div>
        <div>
          <Button type='submit' variant='signup' loading={isLoading}>
            {isLoading ? '新規登録中' : '新規登録'}
          </Button>
        </div>
      </form>

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
