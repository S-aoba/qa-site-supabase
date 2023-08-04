import { createServerComponentClient, type Session } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

import NotFound from '@/app/not-found'
import type { ProfileType, QuestionType } from '@/common/types'
import type { Database } from '@/lib/database.types'

import { AnswerCreateForm } from './answer-create-form'
import { NoAnswerMessage } from './no-answer-message'
import { WithAnswer } from './with-answer'

export const AnswerList = async ({
  profile,
  question,
  session,
}: {
  profile: ProfileType
  question: QuestionType
  session: Session | null
}) => {
  const supabase = createServerComponentClient<Database>({
    cookies,
  })

  const { data: answers, error } = await supabase.from('answers').select('*').eq('question_id', question.id)
  if (error) return <NotFound />

  return (
    <div>
      {answers.length > 0 ? <WithAnswer answers={answers} profile={profile} session={session} /> : <NoAnswerMessage />}
      {session && <AnswerCreateForm userId={session.user.id} question={question} profile={profile} />}
    </div>
  )
}
