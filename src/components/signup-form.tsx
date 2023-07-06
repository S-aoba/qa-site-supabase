'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Button, PasswordInput, TextInput } from '@mantine/core'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { SubmitHandler } from 'react-hook-form'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import Loading from '@/app/loading'
import type { Database } from '@/lib/database.types'

type Schema = z.infer<typeof schema>

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
  const onSubmit: SubmitHandler<Schema> = async (data) => {
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
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* 名前 */}
        <div className='mb-3'>
          <TextInput
            type='text'
            styles={{
              input: {
                border: '1px solid #cbd5e1',
                ':focus': { border: '1px solid #cbd5e1' },
              },
            }}
            placeholder='名前'
            id='username'
            {...register('username', { required: true })}
          />
          <div className='my-3 text-center text-sm text-red-500'>{errors.username?.message}</div>
        </div>

        {/* メールアドレス */}
        <div className='mb-3'>
          <TextInput
            type='email'
            styles={{
              input: {
                border: '1px solid #cbd5e1',
                ':focus': { border: '1px solid #cbd5e1' },
              },
            }}
            placeholder='メールアドレス'
            id='email'
            {...register('email', { required: true })}
          />
          <div className='my-3 text-center text-sm text-red-500'>{errors.email?.message}</div>
        </div>

        {/* パスワード */}
        <div className='mb-5'>
          <PasswordInput
            type='password'
            styles={{
              input: {
                border: '1px solid #cbd5e1',
                ':focus-within': { border: '1px solid #cbd5e1' },
              },
            }}
            placeholder='パスワード'
            id='password'
            {...register('password', { required: true })}
          />
          <div className='my-3 text-center text-sm text-red-500'>{errors.password?.message}</div>
        </div>

        {/* サインアップボタン */}
        <div className='mb-5'>
          {isLoading ? (
            <Loading />
          ) : (
            <Button
              type='submit'
              className='w-full rounded-full bg-slate-500 p-2 text-sm font-bold text-white hover:transform-none hover:bg-slate-500 hover:brightness-95'
            >
              サインアップ
            </Button>
          )}
        </div>
      </form>

      {message && <div className='my-5 text-center text-sm text-red-500'>{message}</div>}

      <div className='text-center text-sm'>
        <Link href='/auth/login' className='font-bold text-gray-500'>
          ログインはこちら
        </Link>
      </div>
    </div>
  )
}
