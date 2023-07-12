'use client'

import type { AnswerType, ProfileType } from '@/common/types'

import { Comment } from '../comment/comment'
import { AnswerBody } from './answer-body'

export const Answer = ({
  answer,
  profile,
  userId,
}: {
  answer: AnswerType
  profile: ProfileType | null
  userId: string | undefined
}) => {
  return (
    <div className='rounded-lg border border-solid border-slate-300'>
      <AnswerBody answer={answer} profile={profile} />
      <Comment answer={answer} profile={profile} userId={userId} />
    </div>
  )
}
