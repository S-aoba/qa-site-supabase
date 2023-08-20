import type { Session } from '@supabase/auth-helpers-nextjs'

import type { QuestionType } from '@/common/types'
import { getAnswers } from '@/common/utils/get-answers'

import { CommentList } from '../comment/comment-list'
import { UserInfo } from '../ui/user-info'
import { AnswerBody } from './answer-body'
import { AnswerForm } from './answer-form'

export const AnswerList = async ({ question, session }: { question: QuestionType; session: Session | null }) => {
  const { answers } = await getAnswers(question.id)
  if (answers === null) return null

  return (
    <div>
      {answers.length <= 0 ? (
        <div className='w-full py-10 text-center text-2xl text-foreground'>回答はまだありません</div>
      ) : (
        <div className='pb-10'>
          <div className='px-2 py-10 text-primary dark:brightness-75'>
            <span className='text-2xl'>{answers.length}</span> 件回答
          </div>
          <div className='flex flex-col space-y-4'>
            {answers.map((answer) => {
              return (
                <div key={answer.id} className='rounded-md bg-background shadow dark:border dark:border-input'>
                  <AnswerBody answer={answer} session={session}>
                    <UserInfo
                      created_at={answer.created_at}
                      updated_at={answer.updated_at}
                      avatar_url={answer.avatar_url}
                      username={answer.username}
                    />
                  </AnswerBody>
                  <CommentList answer={answer} session={session} />
                </div>
              )
            })}
          </div>
        </div>
      )}
      {session && <AnswerForm userId={session.user.id} question={question} />}
    </div>
  )
}
