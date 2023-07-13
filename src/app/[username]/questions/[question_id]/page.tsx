import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

import { Question } from '@/components/question/question'
import type { Database } from '@/lib/database.types'

const QuestionPage = async ({ params }: { params: { username: string; question_id: string } }) => {
  const supabase = createServerComponentClient<Database>({
    cookies,
  })

  // セッションの取得
  const {
    data: { session },
  } = await supabase.auth.getSession()

  return <Question userId={session?.user.id} question_id={params.question_id} />
}
export default QuestionPage
