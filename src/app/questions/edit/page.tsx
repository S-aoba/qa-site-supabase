import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { QuestionForm } from '@/components/question/question-form'
import type { Database } from '@/lib/database.types'

const QuestionEditPage = async () => {
  const supabase = createServerComponentClient<Database>({
    cookies,
  })

  // セッションの取得
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // 未認証の場合、リダイレクト
  if (!session) {
    redirect('/auth/login')
  }
  return <QuestionForm userId={session.user.id}/>
}

export default QuestionEditPage
