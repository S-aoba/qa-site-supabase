'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import type { FormEvent } from 'react'
import { useState } from 'react'

import Loading from '@/app/loading'
import type { Database } from '@/lib/database.types'

// ログアウト
export const Logout = () => {
  const router = useRouter()
  const supabase = createClientComponentClient<Database>()
  const [isLoading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  // 送信
  const handleOnSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      // ログアウト
      const { error } = await supabase.auth.signOut()

      // エラーチェック
      if (error) {
        setMessage('エラーが発生しました。' + error.message)
        return
      }

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
      <div className='mb-5 text-center'>ログアウトしますか？</div>
      {/* ログアウトボタン */}
      <form onSubmit={handleOnSubmit}>
        <div className='mb-5'>
          {isLoading ? (
            <Loading />
          ) : (
            <button
              type='submit'
              className='w-full rounded-full bg-red-500 p-2 text-sm font-bold text-white hover:brightness-95'
            >
              ログアウト
            </button>
          )}
        </div>
      </form>

      {message && <div className='my-5 text-center text-sm text-red-500'>{message}</div>}
    </div>
  )
}