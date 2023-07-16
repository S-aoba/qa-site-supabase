import { createServerComponentClient, type Session } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

import NotFound from '@/app/not-found'
import type { AnswerType, ProfileType } from '@/common/types'
import type { Database } from '@/lib/database.types'

import { Comment } from './comment'

export const CommentList = async ({
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
  const { data: comments, error } = await supabase
    .from('comments')
    .select('*')
    .eq('answer_id', answer.id)
    .order('created_at')

  if (error) return <NotFound />

  return <Comment comments={comments} answer={answer} profile={profile} session={session} />
}
