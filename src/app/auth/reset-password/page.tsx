import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { ResetPasswordForm } from '@/components/auth/reset-password-form'
import type { Database } from '@/lib/database.types'

export const metadata = {
  title: 'パスワードリセット - QA-site-supabase',
  description: 'パスワードリセット - QA-site-supabase',
}

// パスワードリセットページ
const ResetPasswordPage = async () => {
  const supabase = createServerComponentClient<Database>({
    cookies,
  })

  // セッションの取得
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // 認証している場合、リダイレクト
  if (session) {
    redirect('/')
  }

  return <ResetPasswordForm />
}

export default ResetPasswordPage
