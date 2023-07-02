'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import type { NotificationType } from '@/common/types'
import type { Database } from '@/lib/database.types'

export const WithNotification = ({ notification }: { notification: NotificationType }) => {
  const supabase = createClientComponentClient<Database>()
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleDeleteNotification = async () => {
    try {
      const { error: deleteNotificationError } = await supabase.from('notifications').delete().eq('id', notification.id)
      if (deleteNotificationError) {
        setMessage('予期せぬエラーが発生しました。' + deleteNotificationError.message)
        return
      }
      router.refresh()
    } catch (error) {
      setMessage('エラーが発生しました。' + error)
      return
    }
  }
  return (
    <>
      <Link
        href={`/${notification.username}/questions/${notification.question_id}`}
        className='flex h-40 w-60 border-b border-l-0 border-r-0 border-t-0 border-solid border-gray-300 px-5 py-3 text-black no-underline hover:cursor-pointer hover:bg-slate-100'
        onClick={handleDeleteNotification}
      >
        <div className='flex items-center'>
          <Image
            src={`${notification.avatar_url !== null ? notification.avatar_url : 'default.png'}`}
            width={60}
            height={60}
            className=' rounded-full'
            alt='userIcon'
          />
        </div>
        <div className='flex w-full flex-col items-center justify-center p-3'>
          <span className='line-clamp-2 font-semibold'>{notification.title}</span>
          <span className='text-sm'>について回答がありました。</span>
        </div>
      </Link>
      {message && <div className='my-5 text-center text-sm text-red-500'>{message}</div>}
    </>
  )
}
