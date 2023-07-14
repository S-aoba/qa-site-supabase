import type { Session } from '@supabase/auth-helpers-nextjs'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

import NotFound from '@/app/not-found'
import type { AnswerType, ProfileType } from '@/common/types'
import type { Database } from '@/lib/database.types'

import { CommentBody } from './comment-body'
import { CommentCreateForm } from './comment-create-form'
import { CommentUserInfo } from './comment-user-info'

export const Comment = async ({
  answer,
  profile,
  session,
}: {
  answer: AnswerType
  profile: ProfileType | null
  session: Session | null
}) => {
  const supabase = createServerComponentClient<Database>({
    cookies,
  })
  const { data: comments, error } = await supabase.from('comments').select('*').eq('answer_id', answer.id)
  if (error) return <NotFound />

  return (
    <div>
      {comments.length > 0
        ? comments.map((comment) => {
            return (
              <CommentBody key={comment.id} comment={comment} profile={profile} session={session}>
                <CommentUserInfo avatar_url={comment.avatar_url} username={comment.username} />
              </CommentBody>
            )
          })
        : null}
      {session && <CommentCreateForm answer={answer} />}
    </div>
  )
}
