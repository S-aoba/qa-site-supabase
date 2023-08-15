import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { Profile } from '@/components/setting/profile'
import type { Database } from '@/lib/database.types'

export const metadata = {
  title: 'プロフィール - QA-site-supabase',
  description: 'パスワードリセット - QA-site-supabase',
}

const ProfilePage = async () => {
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

  return <Profile />
}

export default ProfilePage
