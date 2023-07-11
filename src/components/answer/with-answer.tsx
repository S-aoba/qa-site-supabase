'use client'

import type { AnswerType } from '@/common/types'

import { AnswerBody } from './answer-body'

export const WithAnswer = ({ answers, userId }: { answers: AnswerType[]; userId: string | undefined }) => {
  return (
    <>
      <div className='p-2 text-2xl font-semibold'>回答</div>
      <div className='space-y-4 py-4'>
        {answers.map((answer) => {
          return <AnswerBody key={answer.id} answer={answer} userId={userId} />
        })}
      </div>
    </>
  )
}
