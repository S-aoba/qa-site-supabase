import { createServerComponentClient, type Session } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

import NotFound from '@/app/not-found'
import type { AnswerType } from '@/common/types'
import type { Database } from '@/lib/database.types'

import { Comment } from './comment'
import { CommentForm } from './comment-form'

export const CommentList = async ({ answer, session }: { answer: AnswerType; session: Session | null }) => {
  const supabase = createServerComponentClient<Database>({
    cookies,
  })
  const { data: comments, error } = await supabase
    .from('comments')
    .select('*')
    .eq('answer_id', answer.id)
    .order('created_at')

  if (error) return <NotFound />

  const commentLength = comments.length

  return (
    <>
      {commentLength > 0 && <Comment comments={comments} session={session} />}
      {session && <CommentForm answer={answer} />}
    </>
  )
}
