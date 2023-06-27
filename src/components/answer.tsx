'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { IconEdit, IconTrash } from '@tabler/icons-react'
import { useSetAtom } from 'jotai'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'

import type { AnswerType } from '@/common/types'
import type { Database } from '@/lib/database.types'
import { editedAnswerAtom } from '@/store/answer-atom'

import { AnswerForm } from './answer-form'

export const Answer = async ({ userId }: { userId: string | undefined }) => {
  const supabase = createClientComponentClient<Database>()

  const pathname = usePathname()
  const question_id = pathname.split('/')[3]

  const { data: answers } = await supabase.from('answers').select('*').eq('question_id', question_id)

  return (
    <div className='p-2'>
      <div className='p-2 text-2xl font-semibold'>Answer</div>
      <div className='space-y-4 py-4'>
        {answers?.map((answer) => {
          return <Description key={answer.id} answer={answer} userId={userId} />
        })}
        {userId && <AnswerForm userId={userId} />}
      </div>
    </div>
  )
}

const Description = async ({ answer, userId }: { answer: AnswerType; userId: string | undefined }) => {
  const router = useRouter()
  const [_, setMessage] = useState('')
  const setEditedAnswer = useSetAtom(editedAnswerAtom)

  const supabase = createClientComponentClient<Database>()
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', answer?.user_id).single()

  const handleDeleteAnswer = async () => {
    try {
      const { error } = await supabase.from('answers').delete().eq('id', answer.id)
      if (error) {
        setMessage('予期せぬエラーが発生しました。' + error.message)
        return
      }
      setEditedAnswer('')
    } catch (error) {
      setMessage('エラーが発生しました。' + error)
      return
    } finally {
      router.refresh()
    }
  }

  return (
    <div className='rounded-lg border border-solid border-slate-300 pb-5'>
      <div className='rounded-t-lg border-b border-l-0 border-r-0 border-t-0 border-solid border-slate-300 bg-[#f6f8fa] px-2'>
        <div className='flex justify-between'>
          <div className='flex items-center space-x-2'>
            <div className='relative h-6 w-6'>
              <Image
                src={profile && profile.avatar_url ? profile.avatar_url : '/default.png'}
                className='rounded-full object-cover'
                alt='avatar'
                fill
                sizes='auto'
                priority
              />
            </div>
            <div>
              <p className='text-sm'>{profile?.username}</p>
            </div>
            <div>
              <span className='text-sm'>投稿日: {answer.created_at.slice(0, 10)}</span>
            </div>
          </div>
          {userId === answer.user_id && (
            <div className='flex items-center space-x-2'>
              <IconEdit className='text-slate-500 hover:cursor-pointer hover:text-slate-700' />
              <IconTrash
                className='text-slate-500 hover:cursor-pointer hover:text-slate-700'
                onClick={handleDeleteAnswer}
              />
            </div>
          )}
        </div>
      </div>
      {answer && <div className='break-words p-3' dangerouslySetInnerHTML={{ __html: answer.description }} />}
    </div>
  )
}