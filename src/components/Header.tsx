'use client'

import type { Session } from '@supabase/supabase-js'
import { useSetAtom } from 'jotai'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect } from 'react'

import type { Database } from '@/lib/database.types'
import { profileAtom } from '@/store/profile-atom'

import { Navigation } from './navigation'

type ProfileType = Database['public']['Tables']['profiles']['Row']

export const Header = ({ session, profile }: { session: Session | null; profile: ProfileType | null }) => {
  const setUser = useSetAtom(profileAtom)

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
    <header className='min-h-14 flex flex-col items-center justify-center gap-x-5 bg-gray-400 pt-3 font-mono text-xl shadow-lg'>
      <div className='mb-2 flex items-center justify-center gap-x-5'>
        <input type='text' className='rounded-lg px-1 py-2 text-sm text-gray-500 shadow-lg outline-gray-300' />
        {session ? (
          <div className='flex gap-x-5'>
            <Link href='/settings/profile'>
              <div className='relative h-10 w-10'>
                <Image
                  src={profile && profile.avatar_url ? profile.avatar_url : '/default.png'}
                  className='rounded-full object-cover'
                  alt='avatar'
                  fill
                  sizes='auto'
                  priority
                />
              </div>
            </Link>
            <button className='rounded-lg border bg-white px-2 py-1 text-gray-500 shadow-lg hover:bg-gray-200'>
              投稿
            </button>
            <Navigation />
          </div>
        ) : (
          <div className='flex items-center space-x-5'>
            <Link href='/auth/login'>ログイン</Link>
            <Link href='/auth/signup'>サインアップ</Link>
          </div>
        )}
      </div>
    </header>
  )
}
