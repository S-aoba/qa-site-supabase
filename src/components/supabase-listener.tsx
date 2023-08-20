import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

import type { Database } from '@/lib/database.types'

import { MainNavigation } from './navigation/main-navigation'
import { SubNavigation } from './navigation/sub-navigation'
import { Notification } from './notification/notification'

// 認証状態の監視
export const SupabaseListener = async () => {
  const supabase = createServerComponentClient<Database>({ cookies })

  // セッションの取得
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // プロフィールの取得
  let profile = null

  if (session) {
    const { data: currentProfile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single()

    profile = currentProfile

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

  return (
    <>
      <MainNavigation session={session} />
      <SubNavigation session={session} profile={profile}>
        {session && <Notification user_id={session.user.id} />}
      </SubNavigation>
    </>
  )
}
