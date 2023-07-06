import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { QuestionsAnswered } from '@/components/setting/questions-answered'
import type { Database } from '@/lib/database.types'

const QuestionsAnsweredPage = async () => {
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

  return <QuestionsAnswered userId={session.user.id} />
}
export default QuestionsAnsweredPage
