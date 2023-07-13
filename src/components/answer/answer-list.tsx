'use client'

import type { Session } from '@supabase/auth-helpers-nextjs'

import type { AnswerType, ProfileType, QuestionType } from '@/common/types'

import { AnswerCreateForm } from './answer-create-form'
import { NoAnswerMessage } from './no-answer-message'
import { WithAnswer } from './with-answer'

export const AnswerList = ({
  answers,
  profile,
  question,
  session,
}: {
  answers: AnswerType[]
  profile: ProfileType | null
  question: QuestionType
  session: Session | null
}) => {
  return (
    <div>
      {answers !== null && answers.length > 0 ? (
        <WithAnswer answers={answers} profile={profile} session={session} />
      ) : (
        <NoAnswerMessage />
      )}
      {session && <AnswerCreateForm userId={session.user.id} question={question} profile={profile} />}
    </div>
  )
}
