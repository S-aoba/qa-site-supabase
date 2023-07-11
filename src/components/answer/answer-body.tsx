'use client'

import { useState } from 'react'

import type { AnswerType, ProfileType } from '@/common/types'

import { Comment } from '../comment/comment'
import { AnswerActions } from './answer-actions'
import { AnswerContent } from './answer-content'
import { AnswerUserInfo } from './answer-user-info'

export const AnswerBody = ({ answer, profile }: { answer: AnswerType; profile: ProfileType | null }) => {
  const [isEditMode, setIsEditMode] = useState(false)

  return (
    <div className='rounded-lg border border-solid border-slate-300'>
      <div className='rounded-t-lg border-b border-l-0 border-r-0 border-t-0 border-solid border-slate-300 bg-[#f6f8fa] px-2'>
        <div className='flex justify-between'>
          <AnswerUserInfo profile={profile} created_at={answer.created_at} />
          <AnswerActions profile={profile} answer={answer} isEditMode={isEditMode} setIsEditMode={setIsEditMode} />
        </div>
      </div>
      <AnswerContent answer={answer} isEditMode={isEditMode} />
      <Comment answer={answer} profile={profile} />
    </div>
  )
}
