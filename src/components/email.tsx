'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Button, TextInput } from '@mantine/core'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
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

// メールアドレス変更
export const Email = ({ email }: { email: string | undefined }) => {
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
      // メールアドレス変更メールを送信
      const { error: updateUserError } = await supabase.auth.updateUser(
        { email: data.email },
        { emailRedirectTo: `${location.origin}/auth/login` }
      )

      // エラーチェック
      if (updateUserError) {
        setMessage('エラーが発生しました。' + updateUserError.message)
        return
      }

      setMessage('確認用のURLを記載したメールを送信しました。')

      // ログアウト
      const { error: signOutError } = await supabase.auth.signOut()

      // エラーチェック
      if (signOutError) {
        setMessage('エラーが発生しました。' + signOutError.message)

        return
      }

      router.push('/auth/login')
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
      <div className='mb-10 text-center text-xl font-bold'>メールアドレス変更</div>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* 現在のメールアドレス */}
        <div className='mb-5'>
          <div className='mb-1 text-sm font-bold'>現在のメールアドレス</div>
          <div>{email && email}</div>
        </div>

        {/* 新しいメールアドレス */}
        <div className='mb-5'>
          <div className='mb-1 text-sm font-bold'>新しいメールアドレス</div>
          <TextInput
            type='email'
            styles={{
              input: {
                border: '1px solid #cbd5e1',
                ':focus': { border: '1px solid #cbd5e1' },
              },
            }}
            placeholder='新しいメールアドレス'
            id='email'
            {...register('email', { required: true })}
          />
          <div className='my-3 text-center text-sm text-red-500'>{errors.email?.message}</div>
        </div>

        {/* 変更ボタン */}
        <div className='mb-5'>
          {isLoading ? (
            <Loading />
          ) : (
            <Button
              type='submit'
              className='w-full rounded-full bg-slate-500 p-2 text-sm font-bold text-white hover:bg-slate-500 hover:brightness-95'
            >
              変更
            </Button>
          )}
        </div>
      </form>

      {message && <div className='my-5 text-center text-sm text-red-500'>{message}</div>}
    </div>
  )
}
