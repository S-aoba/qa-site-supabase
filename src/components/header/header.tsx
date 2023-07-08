'use client'

import type { Session } from '@supabase/supabase-js'
import { useAtom } from 'jotai'
import { useEffect } from 'react'

import type { NotificationType } from '@/common/types'
import type { Database } from '@/lib/database.types'
import { profileAtom } from '@/store/profile-atom'

import { Notification } from '../notification/notification'
import { HeaderLogo } from './header-logo'
import { HeaderNoSession } from './header-no-session'
import { HeaderSearch } from './header-search'
import { HeaderWithSession } from './header-with-session'

type ProfileType = Database['public']['Tables']['profiles']['Row']

export const Header = ({
  session,
  profile,
  notifications,
}: {
  session: Session | null
  profile: ProfileType | null
  notifications: NotificationType[] | null
}) => {
  const [user, setUser] = useAtom(profileAtom)

  // 状態管理にユーザー情報を保存
  useEffect(() => {
    if (session && session.user.email !== undefined) {
      setUser({
        id: session ? session.user.id : '',
        email: session ? session.user.email : '',
        username: session && profile ? profile.username : '',
        introduce: session && profile ? profile.introduce : '',
        avatar_url: session && profile ? profile.avatar_url : '',
        twitter_url: session && profile ? profile.twitter_url : '',
        github_url: session && profile ? profile.github_url : '',
        website_url: session && profile ? profile.website_url : '',
      })
    }
  }, [session, setUser, profile])

  return (
    <header className='flex h-fit flex-col items-center justify-center bg-[#f6f8fa] p-3 font-mono text-base'>
      <div className='container mx-auto flex w-full justify-between'>
        <HeaderLogo />
        <div className=' flex w-7/12'>
          <HeaderSearch />
          {session ? (
            <HeaderWithSession avatar_url={user.avatar_url}>
              <Notification notifications={notifications} />
            </HeaderWithSession>
          ) : (
            <HeaderNoSession />
          )}
        </div>
      </div>
    </header>
  )
}
