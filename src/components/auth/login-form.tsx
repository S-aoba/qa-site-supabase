'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { ReloadIcon } from '@radix-ui/react-icons'
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

export type LoginSchema = z.infer<typeof schema>

// 入力データの検証ルールを定義
const schema = z.object({
  email: z.string().email({ message: 'メールアドレスの形式ではありません。' }),
  password: z.string().min(6, { message: '6文字以上入力する必要があります。' }),
})
export const LoginForm = () => {
  const router = useRouter()
  const supabase = createClientComponentClient<Database>()
  const [isLoading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    // 初期値
    defaultValues: { email: '', password: '' },
    // 入力値の検証
    resolver: zodResolver(schema),
  })

  // 送信
  const onSubmit: SubmitHandler<LoginSchema> = async (data) => {
    setLoading(true)

    try {
      // ログイン
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
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
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='flex flex-col rounded-lg border border-solid border-slate-300 bg-[#f6f8fa] p-5'
      >
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
        <div className='flex justify-end'>
          <Button type='submit' variant='outline' disabled={isLoading}>
            {isLoading && <ReloadIcon className='mr-2 h-4 w-4 animate-spin' />}
            {isLoading ? 'ログイン中' : 'ログイン'}
          </Button>
        </div>
      </form>

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
