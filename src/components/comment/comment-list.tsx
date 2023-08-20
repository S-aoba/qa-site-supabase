import { type Session } from '@supabase/auth-helpers-nextjs'

import type { AnswerType } from '@/common/types'
import { getComments } from '@/common/utils/get-comment'

import { Comment } from './comment'
import { CommentForm } from './comment-form'

export const CommentList = async ({ answer, session }: { answer: AnswerType; session: Session | null }) => {
  const { comments } = await getComments(answer.id)
  if (comments === null) return null

  return (
    <>
      {comments.length > 0 && <Comment comments={comments} session={session} />}
      {session && <CommentForm answer={answer} />}
    </>
  )
}
