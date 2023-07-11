'use client'

import { useState } from 'react'

import type { AnswerType, ProfileType } from '@/common/types'

import { Comment } from '../comment/comment'
import { AnswerContent } from './answer-content'
import { AnswerSettings } from './answer-settings'

export const AnswerBody = async ({ answer, profile }: { answer: AnswerType; profile: ProfileType | null }) => {
  const [isEditMode, setIsEditMode] = useState(false)

  return (
    <div className='rounded-lg border border-solid border-slate-300'>
      <AnswerSettings answer={answer} profile={profile} isEditMode={isEditMode} setIsEditMode={setIsEditMode} />
      <AnswerContent answer={answer} isEditMode={isEditMode} />
      <Comment answer={answer} profile={profile} />
    </div>
  )
}
