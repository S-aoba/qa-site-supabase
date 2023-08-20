import type { Session } from '@supabase/auth-helpers-nextjs'

import { getSingleQuestion } from '@/common/utils/get-single-question'

import { AnswerList } from '../answer/answer-list'
import { Action } from '../ui/action'
import { UserInfo } from '../ui/user-info'
import { QuestionMessage } from './question-message'
import { QuestionTags } from './question-tags'

export const Question = async ({ session, question_id }: { session: Session | null; question_id: string }) => {
  const { singleQuestion } = await getSingleQuestion(question_id)

  if (singleQuestion === null) return null

  const profile = singleQuestion.profiles

  return (
    <div className='flex w-full flex-col items-center'>
      <div className='w-full max-w-[800px] p-2'>
        <div className='mb-4 mt-2 text-center'>
          <h1 className='text-2xl text-primary dark:brightness-75'>{singleQuestion.title}</h1>
        </div>
        <div className='rounded-md bg-background shadow dark:border dark:border-input'>
          <div>
            <div className='flex justify-between overflow-x-hidden border-b border-input px-2'>
              {profile && (
                <UserInfo
                  created_at={singleQuestion.created_at}
                  updated_at={singleQuestion.updated_at}
                  avatar_url={profile.avatar_url}
                  username={profile.username}
                  coding_problem={singleQuestion.coding_problem}
                />
              )}
              {session && session.user.id === singleQuestion.user_id && <Action question={singleQuestion} />}
            </div>
            <QuestionTags tags={singleQuestion.tags} />
            <div
              className='prose prose-sm m-2 pb-2 pl-5 text-primary dark:prose-invert sm:prose-base focus:outline-none dark:brightness-75'
              dangerouslySetInnerHTML={{ __html: singleQuestion.content }}
            />
          </div>
        </div>
        <AnswerList question={singleQuestion} session={session} />
        {!session && <QuestionMessage />}
      </div>
    </div>
  )
}
