'use client'

import type { AnswerType, ProfileType, QuestionType } from '@/common/types'

import { AnswerCreateForm } from './answer-create-form'
import { NoAnswerMessage } from './no-answer-message'
import { WithAnswer } from './with-answer'

export const Answer = async ({
  answers,
  profile,
  question,
}: {
  answers: AnswerType[]
  profile: ProfileType | null
  question: QuestionType
}) => {
  return (
    <div className='p-2'>
      {answers !== null && answers.length > 0 ? (
        <WithAnswer answers={answers} profile={profile} />
      ) : (
        <NoAnswerMessage />
      )}
      {profile && <AnswerCreateForm userId={profile.id} question={question} />}
    </div>
  )
}
