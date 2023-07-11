'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

import NotFound from '@/app/not-found'
import type { Database } from '@/lib/database.types'

import { Answer } from '../answer/answer'
import { QuestionActions } from './question-actions'

export const Question = async ({ userId }: { userId: string | undefined }) => {
  const supabase = createClientComponentClient<Database>()

  const [message, setMessage] = useState('')

  const pathname = usePathname()
  const question_id = pathname.split('/')[3]

  const { data: question, error } = await supabase
    .from('questions')
    .select('*, answers(*), profiles(*)')
    .eq('id', question_id)
    .single()

  if (error) return <NotFound />

  const answers = question.answers
  const profile = question.profiles

  return (
    <>
      <div className='p-2'>
        <div className='text-center'>
          <h1>{question?.title}</h1>
        </div>
        <div className='rounded-lg border border-solid border-slate-300 pb-5'>
          <div className='rounded-t-lg border-b border-l-0 border-r-0 border-t-0 border-solid border-slate-300 bg-[#f6f8fa] px-2'>
            <div className='flex justify-between '>
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
                  <span className='text-sm'>投稿日: {question?.created_at.slice(0, 10)}</span>
                </div>
                <span className='line-clamp-1 w-fit max-w-[500px] rounded-lg bg-slate-500 px-2 py-1 text-sm leading-5 text-stone-50'>
                  {question?.coding_problem}
                </span>
              </div>
              <QuestionActions userId={userId} question={question} setMessage={setMessage} />
            </div>
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
          {question && <div className='break-words p-3' dangerouslySetInnerHTML={{ __html: question.content }} />}
        </div>
      </div>
      {message && <div className='my-5 text-center text-sm text-red-500'>{message}</div>}

      {question && <Answer answers={answers} profile={profile} question={question} />}
    </>
  )
}
