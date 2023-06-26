import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

import { Answer } from '@/components/answer'
import { Question } from '@/components/question'
import type { Database } from '@/lib/database.types'

const QuestionPage = async () => {
  const supabase = createServerComponentClient<Database>({
    cookies,
  })

  // セッションの取得
  const {
    data: { session },
  } = await supabase.auth.getSession()

  return (
    <>
      <Question />
      <Answer userId={session?.user.id}/>
    </>
  )
}
export default QuestionPage
