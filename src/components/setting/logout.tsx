'use client'

import { ReloadIcon } from '@radix-ui/react-icons'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useSetAtom } from 'jotai'
import { useRouter } from 'next/navigation'
import type { FormEvent } from 'react'
import { useState } from 'react'

import type { Database } from '@/lib/database.types'
import { displayMainNavNameAtom } from '@/store/navigation-atom'

import { Button } from '../ui/button'

// ログアウト
export const Logout = () => {
  const router = useRouter()
  const supabase = createClientComponentClient<Database>()
  const [isLoading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const setDisplayMainNavName = useSetAtom(displayMainNavNameAtom)

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
      setDisplayMainNavName("質問")
      router.refresh()
    }
  }

  return (
    <div>
      <div className='mb-5 text-center'>ログアウトしますか？</div>
      {/* ログアウトボタン */}
      <form onSubmit={handleOnSubmit}>
        <div className='mb-5'>
          <Button type='submit' variant='destructive' disabled={isLoading}>
            {isLoading && <ReloadIcon className='mr-2 h-4 w-4 animate-spin' />}
            {isLoading ? 'ログアウト中' : 'ログアウト'}
          </Button>
        </div>
      </form>

      {message && <div className='my-5 text-center text-sm text-red-500'>{message}</div>}
    </div>
  )
}
