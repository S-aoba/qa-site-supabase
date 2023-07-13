import type { Session } from '@supabase/auth-helpers-nextjs'

import type { AnswerType, ProfileType } from '@/common/types'

import { AnswerActions } from './answer-actions'
import { AnswerContent } from './answer-content'
import { AnswerUserInfo } from './answer-user-info'

export const AnswerBody = ({
  answer,
  session,
  profile,
}: {
  answer: AnswerType
  session: Session | null
  profile: ProfileType | null
}) => {
  return (
    <>
      <div className='rounded-t-lg border-b border-l-0 border-r-0 border-t-0 border-solid border-slate-300 bg-[#f6f8fa] px-2'>
        <div className='flex justify-between'>
          <AnswerUserInfo profile={profile} created_at={answer.created_at} />
          {session && <AnswerActions answer={answer} />}
        </div>
      </div>
      <AnswerContent answer={answer} />
    </>
  )
}
