import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

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

  return <Question userId={session?.user.id} />
}
export default QuestionPage
