import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { Email } from '@/components/setting/email'
import type { Database } from '@/lib/database.types'

export const metadata = {
  title: 'メールアドレス変更 - QA-site-supabase',
  description: 'メールアドレス変更 - QA-site-supabase',
}

const EmailPage = async () => {
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

  return <Email email={session.user.email} />
}

export default EmailPage
