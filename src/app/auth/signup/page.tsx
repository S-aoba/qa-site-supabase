import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { SignupForm } from '@/components/auth/signup-form'
import type { Database } from '@/lib/database.types'

export const metadata = {
  title: '新規登録 - QA-site-supabase',
  description: '新規登録 - QA-site-supabase',
}

const SignupPage = async () => {
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

  return <SignupForm />
}

export default SignupPage
