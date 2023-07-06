'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Button, TextInput } from '@mantine/core'
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
  email: z.string().email({ message: 'メールアドレスの形式ではありません。' }),
})

// パスワードリセットページ
export const ResetPassword = () => {
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
    defaultValues: { email: '' },
    // 入力値の検証
    resolver: zodResolver(schema),
  })

  // 送信
  const onSubmit: SubmitHandler<Schema> = async (data) => {
    setLoading(true)
    setMessage('')

    try {
      // パスワードリセットメールを送信
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
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
    <div className='mx-auto max-w-[400px]'>
      <div className='mb-10 text-center text-xl font-bold'>パスワードを忘れた場合</div>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* メールアドレス */}
        <div className='mb-5'>
          <div className='mb-1 text-sm font-bold'>メールアドレス</div>
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

        {/* 送信ボタン */}
        <div className='mb-5'>
          {isLoading ? (
            <Loading />
          ) : (
            <Button
              type='submit'
              className='w-full rounded-full bg-slate-500 p-2 text-sm font-bold text-white hover:transform-none hover:bg-slate-500 hover:brightness-95'
            >
              送信
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
