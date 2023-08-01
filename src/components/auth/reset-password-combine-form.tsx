'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { ReloadIcon } from '@radix-ui/react-icons'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { SubmitHandler } from 'react-hook-form'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import type { Database } from '@/lib/database.types'

import { Button } from '../ui/button'
import { Input } from '../ui/input'

type Schema = z.infer<typeof schema>

// 入力データの検証ルールを定義
const schema = z
  .object({
    password: z.string().min(6, { message: '6文字以上入力する必要があります。' }),
    confirmation: z.string().min(6, { message: '6文字以上入力する必要があります。' }),
  })
  .refine(
    (data) => {
      return data.password === data.confirmation
    },
    {
      message: '新しいパスワードと確認用パスワードが一致しません。',
      path: ['confirmation'], // エラーメッセージが適用されるフィールド
    }
  )

// パスワード変更
export const ResetPasswordCombineForm = () => {
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
    defaultValues: { password: '', confirmation: '' },
    // 入力値の検証
    resolver: zodResolver(schema),
  })

  // 送信
  const onSubmit: SubmitHandler<Schema> = async (data) => {
    setLoading(true)
    setMessage('')

    try {
      // パスワードの更新
      const { error } = await supabase.auth.updateUser({
        password: data.password,
      })

      if (error) {
        setMessage('エラーが発生しました。' + error.message)
        return
      }

      reset()
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
    <div>
      <div className='mb-10 text-center text-xl font-bold'>パスワード変更</div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className='flex flex-col rounded-lg border border-solid border-slate-300 bg-[#f6f8fa] p-5'
      >
        <div>
          <div className='mb-1 text-sm font-bold'>新しいパスワード</div>
          <Input
            id='password'
            type='password'
            placeholder='新しいパスワード'
            autoComplete='new-password'
            {...register('password', { required: true })}
          />
          <div className='my-3 text-center text-sm text-red-500'>{errors.password?.message}</div>
        </div>

        <div>
          <div className='mb-1 text-sm font-bold'>確認用パスワード</div>
          <Input
            id='confirmation'
            type='password'
            placeholder='確認用パスワード'
            autoComplete='new-password'
            {...register('confirmation', { required: true })}
          />
          <div className='my-3 text-center text-sm text-red-500'>{errors.confirmation?.message}</div>
        </div>

        {/* 変更ボタン */}
        <div className='flex justify-end'>
          <Button type='submit' variant='default' disabled={isLoading}>
            {isLoading && <ReloadIcon className='mr-2 h-4 w-4 animate-spin' />}
            {isLoading ? '更新中' : '更新'}
          </Button>
        </div>

        {/* メッセージ */}
        {message && <div className='pt-3 text-center text-sm text-red-500'>{message}</div>}
      </form>
    </div>
  )
}
