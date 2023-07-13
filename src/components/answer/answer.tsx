import type { Session } from '@supabase/auth-helpers-nextjs'

import type { AnswerType, ProfileType } from '@/common/types'

import { Comment } from '../comment/comment'
import { AnswerBody } from './answer-body'
import { AnswerUserInfo } from './answer-user-info'

export const Answer = ({
  answer,
  profile,
  session,
}: {
  answer: AnswerType
  profile: ProfileType | null
  session: Session | null
}) => {
  return (
    <div className='rounded-lg border border-solid border-slate-300'>
      <AnswerBody answer={answer} session={session}>
        <AnswerUserInfo profile={profile} created_at={answer.created_at} />
      </AnswerBody>
      <Comment answer={answer} profile={profile} session={session} />
    </div>
  )
}
