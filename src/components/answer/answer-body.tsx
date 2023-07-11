'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Image from 'next/image'
import { useState } from 'react'

import type { AnswerType } from '@/common/types'
import type { Database } from '@/lib/database.types'

import { Comment } from '../comment/comment'
import { CommentCreateForm } from '../comment/comment-create-form'
import { AnswerActions } from './answer-actions'
import { Content } from './answer-content'

export const AnswerBody = async ({ answer, userId }: { answer: AnswerType; userId: string | undefined }) => {
  const [isEditMode, setIsEditMode] = useState(false)

  const supabase = createClientComponentClient<Database>()
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', answer?.user_id).single()
  const { data: comments } = await supabase.from('comments').select('*').eq('answer_id', answer.id)

  return (
    <div className='rounded-lg border border-solid border-slate-300'>
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
          <AnswerActions userId={userId} answer={answer} isEditMode={isEditMode} setIsEditMode={setIsEditMode} />
        </div>
      </div>
      <Content answer={answer} isEditMode={isEditMode} userId={userId} />
      {comments?.map((comment) => {
        return <Comment key={comment.id} comment={comment} userId={userId} />
      })}
      <CommentCreateForm answer={answer} userId={userId} />
    </div>
  )
}
