import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { QuestionPost } from '@/components/question/question-post'
import type { Database } from '@/lib/database.types'

// メールアドレス変更ページ
const QuestionPostPage = async () => {
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

  return <QuestionPost userId={session.user.id} />
}

export default QuestionPostPage
