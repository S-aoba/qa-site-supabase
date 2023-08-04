import type { Session } from '@supabase/auth-helpers-nextjs'

import type { AnswerType, ProfileType } from '@/common/types'

import { CommentList } from '../comment/comment-list'
import { UserInfo } from '../ui/user-info'
import { AnswerBody } from './answer-body'

export const Answer = ({
  answer,
  profile,
  session,
}: {
  answer: AnswerType
  profile: ProfileType
  session: Session | null
}) => {
  return (
    <div className='rounded-lg border border-solid border-slate-300'>
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
}
