import type { Session } from '@supabase/auth-helpers-nextjs'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

import NotFound from '@/app/not-found'
import type { Database } from '@/lib/database.types'

import { AnswerList } from '../answer/answer-list'
import { Action } from '../ui/action'
import { UserInfo } from '../ui/user-info'
import { QuestionMessage } from './question-message'
import { QuestionTags } from './question-tags'

export const Question = async ({ session, question_id }: { session: Session | null; question_id: string }) => {
  const supabase = createServerComponentClient<Database>({
    cookies,
  })

  const { data: question, error } = await supabase
    .from('questions')
    .select('*, profiles(*)')
    .eq('id', question_id)
    .single()

  if (error || question.profiles === null) return <NotFound />

  const profile = question.profiles

  return (
    <>
      <div className='p-2'>
        <div className='text-center'>
          <h1>{question.title}</h1>
        </div>
        <div className='rounded-lg border pb-5'>
          <div className='border-b px-2'>
            <div className='flex justify-between'>
              <UserInfo
                created_at={question.created_at}
                updated_at={question.updated_at}
                avatar_url={profile.avatar_url}
                username={profile.username}
                coding_problem={question.coding_problem}
              />
              {session && session.user.id === question.user_id && <Action type='question' question={question} />}
            </div>
            <QuestionTags tags={question.tags} />
          </div>
          <div
            className='prose prose-sm prose-slate break-words p-3 lg:prose'
            dangerouslySetInnerHTML={{ __html: question.content }}
          />
        </div>
      </div>
      <AnswerList question={question} session={session} />
      {!session && <QuestionMessage />}
    </>
  )
}
