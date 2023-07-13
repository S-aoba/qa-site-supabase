'use client'

import type { Session } from '@supabase/auth-helpers-nextjs'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

import type { AnswerType, ProfileType } from '@/common/types'
import type { Database } from '@/lib/database.types'

import { CommentBody } from './comment-body'
import { CommentCreateForm } from './comment-create-form'

export const Comment = async ({
  answer,
  profile,
  session,
}: {
  answer: AnswerType
  profile: ProfileType | null
  session: Session | null
}) => {
  const supabase = createClientComponentClient<Database>()
  const { data: comments } = await supabase.from('comments').select('*').eq('answer_id', answer.id)

  return (
    <>
      {comments?.map((comment) => {
        return <CommentBody key={comment.id} comment={comment} profile={profile} session={session} />
      })}
      {session && <CommentCreateForm answer={answer} />}
    </>
  )
}
