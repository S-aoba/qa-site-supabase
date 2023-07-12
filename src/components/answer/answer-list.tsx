'use client'

import type { AnswerType, ProfileType, QuestionType } from '@/common/types'

import { AnswerCreateForm } from './answer-create-form'
import { NoAnswerMessage } from './no-answer-message'
import { WithAnswer } from './with-answer'

export const AnswerList = ({
  answers,
  profile,
  question,
  userId,
}: {
  answers: AnswerType[]
  profile: ProfileType | null
  question: QuestionType
  userId: string | undefined
}) => {
  return (
    <div className='p-2'>
      {answers !== null && answers.length > 0 ? (
        <WithAnswer answers={answers} profile={profile} userId={userId} />
      ) : (
        <NoAnswerMessage />
      )}
      {userId && <AnswerCreateForm userId={userId} question={question} />}
    </div>
  )
}
