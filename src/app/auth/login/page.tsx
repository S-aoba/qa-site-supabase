import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { LoginForm } from '@/components/auth/login-form'
import type { Database } from '@/lib/database.types'

export const metadata = {
  title: 'ログイン - QA-site-supabase',
  description: 'ログイン - QA-site-supabase',
}

// ログインページ
const LoginPage = async () => {
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

  return <LoginForm />
}

export default LoginPage
