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
    <div className='pb-10'>
      <div className='px-2 py-10 text-2xl font-semibold'>
        <span className='text-slate-500'>{answers.length}</span>件回答
      </div>
      <div className='flex flex-col space-y-4'>
        {answers.map((answer) => {
          return <Answer key={answer.id} answer={answer} profile={profile} userId={userId} />
        })}
      </div>
    </div>
  )
}
