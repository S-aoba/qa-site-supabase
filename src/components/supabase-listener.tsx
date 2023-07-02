import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

import type { Database } from '@/lib/database.types'

import { Header } from './header'

// 認証状態の監視
export const SupabaseListener = async () => {
  const supabase = createServerComponentClient<Database>({ cookies })

  // セッションの取得
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // プロフィールの取得
  let profile = null
  let notifications = null

  if (session) {
    const { data: currentProfile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single()
    const { data: currentNotifications } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', currentProfile?.id)

    profile = currentProfile
    notifications = currentNotifications

    // メールアドレスを変更した場合、プロフィールを更新
    if (currentProfile && currentProfile.email !== session.user.email) {
      // メールアドレスを更新
      const { data: updatedProfile } = await supabase
        .from('profiles')
        .update({ email: session.user.email })
        .match({ id: session.user.id })
        .select('*')
        .single()

      profile = updatedProfile
    }
  }

  return <Header session={session} profile={profile} notifications={notifications} />
}
