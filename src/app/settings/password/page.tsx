import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { Password } from '@/components/setting/password'
import type { Database } from '@/lib/database.types'

export const metadata = {
  title: 'パスワードリセット - QA-site-supabase',
  description: 'パスワードリセット - QA-site-supabase',
}

const PasswordPage = async () => {
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

  return <Password />
}

export default PasswordPage
