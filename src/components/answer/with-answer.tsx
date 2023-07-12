'use client'

import type { AnswerType, ProfileType } from '@/common/types'

import { Answer } from './answer'

export const WithAnswer = ({
  answers,
  profile,
  userId,
}: {
  answers: AnswerType[]
  profile: ProfileType | null
  userId: string | undefined
}) => {
  return (
    <>
      <div className='p-2 text-2xl font-semibold'>
        <span className='text-slate-500'>{answers.length}</span>件回答
      </div>
      <div className='space-y-4 py-4'>
        {answers.map((answer) => {
          return <Answer key={answer.id} answer={answer} profile={profile} userId={userId} />
        })}
      </div>
    </>
  )
}
