import { createServerComponentClient, type Session } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

import NotFound from '@/app/not-found'
import type { ProfileType, QuestionType } from '@/common/types'
import type { Database } from '@/lib/database.types'

import { Answer } from './answer'
import { AnswerForm } from './answer-form'

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
      {answers.length > 0 ? (
        <div className='pb-10'>
          <div className='px-2 py-10 text-2xl font-semibold'>
            <span className='text-slate-500'>{answers.length}</span>件回答
          </div>
          <div className='flex flex-col space-y-4'>
            {answers.map((answer) => {
              return <Answer key={answer.id} answer={answer} profile={profile} session={session} />
            })}
          </div>
        </div>
      ) : (
        <div className='w-full py-10 text-center text-2xl font-semibold'>回答はまだありません</div>
      )}
      {session && <AnswerForm userId={session.user.id} question={question} profile={profile} />}
    </div>
  )
}
