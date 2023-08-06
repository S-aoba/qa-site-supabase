import { createServerComponentClient, type Session } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

import NotFound from '@/app/not-found'
import type { ProfileType, QuestionType } from '@/common/types'
import type { Database } from '@/lib/database.types'

import { CommentList } from '../comment/comment-list'
import { UserInfo } from '../ui/user-info'
import { AnswerBody } from './answer-body'
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
          <div className='px-2 py-10'>
            <span className=''>{answers.length}</span>件回答
          </div>
          <div className='flex flex-col space-y-4'>
            {answers.map((answer) => {
              return (
                <div key={answer.id} className='rounded-lg border'>
                  <AnswerBody answer={answer} session={session}>
                    <UserInfo
                      created_at={answer.created_at}
                      updated_at={answer.updated_at}
                      avatar_url={profile.avatar_url}
                      username={profile.username}
                    />
                  </AnswerBody>
                  <CommentList answer={answer} session={session} />
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        <div className='w-full py-10 text-center'>回答はまだありません</div>
      )}
      {session && <AnswerForm userId={session.user.id} question={question} profile={profile} />}
    </div>
  )
}
