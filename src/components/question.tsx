'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { IconEdit, IconTrash } from '@tabler/icons-react'
import { useAtom, useSetAtom } from 'jotai'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'

import type { Database } from '@/lib/database.types'
import { editedQuestionAtom, editedQuestionContentAtom, isEditModeAtom } from '@/store/question-atom'

import { Answer } from './answer'

export const Question = async ({ userId }: { userId: string | undefined }) => {
  const router = useRouter()

  const setEditedQuestion = useSetAtom(editedQuestionAtom)
  const setQuestionDescription = useSetAtom(editedQuestionContentAtom)
  const [isEditMode, setIsEditMode] = useAtom(isEditModeAtom)
  const supabase = createClientComponentClient<Database>()

  const [message, setMessage] = useState('')

  const pathname = usePathname()
  const question_id = pathname.split('/')[3]

  const { data: question } = await supabase.from('questions').select('*').eq('id', question_id).single()
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', question?.user_id).single()

  const handleSetQuestion = () => {
    if (!question) return
    setQuestionDescription(question.content)
    setEditedQuestion({
      id: question.id,
      title: question.title,
      coding_problem: question.coding_problem,
      tags: question.tags,
    })
    setIsEditMode({ ...isEditMode, question: true })
  }

  const handleDeleteQuestion = async () => {
    if (question === null) return
    try {
      const { error } = await supabase.from('questions').delete().eq('id', question.id)
      if (error) {
        setMessage('予期せぬエラーが発生しました。' + error.message)
        return
      }
      router.push('/')
    } catch (error) {
      setMessage('エラーが発生しました。' + error)
      return
    } finally {
      router.refresh()
    }
  }

  return (
    <>
      <div className='p-2'>
        {/* Title */}
        <div className='text-center'>
          <h1>{question?.title}</h1>
        </div>
        <div className='rounded-lg border border-solid border-slate-300 pb-5'>
          <div className='rounded-t-lg border-b border-l-0 border-r-0 border-t-0 border-solid border-slate-300 bg-[#f6f8fa] px-2'>
            {/* user and question info */}
            <div className='flex justify-between '>
              <div className='flex items-center space-x-2'>
                {/* userIcon */}
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
                {/* username */}
                <div>
                  <p className='text-sm'>{profile?.username}</p>
                </div>
                {/* question posted day */}
                <div>
                  <span className='text-sm'>投稿日: {question?.created_at.slice(0, 10)}</span>
                </div>
                <span className='line-clamp-1 w-fit max-w-[500px] rounded-lg bg-slate-500 px-2 py-1 text-sm leading-5 text-stone-50'>
                  {question?.coding_problem}
                </span>
              </div>
              {userId === question?.user_id && (
                <div className='flex items-center space-x-2'>
                  <Link href={'/questions/post'} className='flex items-center'>
                    <IconEdit
                      className='text-slate-500 hover:cursor-pointer hover:text-slate-700'
                      onClick={handleSetQuestion}
                    />
                  </Link>
                  <IconTrash
                    className='text-slate-500 hover:cursor-pointer hover:text-slate-700'
                    onClick={handleDeleteQuestion}
                  />
                </div>
              )}
            </div>
            {/* tags */}
            <div className='flex space-x-3 py-2 text-sm'>
              {question?.tags.map((tag, index) => {
                return (
                  <Link
                    key={index}
                    href={'/'}
                    className='flex items-center space-x-2 rounded-xl border border-solid border-slate-400 px-2 py-1 text-black no-underline'
                  >
                    <div className='relative h-4 w-4'>
                      <Image
                        src={`/lang-icon/${tag}.svg`}
                        className='rounded-full object-cover'
                        alt='avatar'
                        fill
                        sizes='auto'
                        priority
                      />
                    </div>
                    <span className='text-slate-600'>{tag}</span>
                  </Link>
                )
              })}
            </div>
          </div>
          {/* description */}
          {question && <div className='break-words p-3' dangerouslySetInnerHTML={{ __html: question.content }} />}
        </div>
      </div>
      {message && <div className='my-5 text-center text-sm text-red-500'>{message}</div>}

      {question && <Answer userId={userId} question={question} />}
    </>
  )
}
