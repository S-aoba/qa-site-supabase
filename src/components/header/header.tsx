'use client'

import { Button } from '@mantine/core'
import type { Session } from '@supabase/supabase-js'
import { useSetAtom } from 'jotai'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect } from 'react'

import type { NotificationType } from '@/common/types'
import type { Database } from '@/lib/database.types'
import { profileAtom } from '@/store/profile-atom'

import { Notification } from '../notification/notification'
import { HeaderSearch } from './header-search'

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
    <header className='flex h-fit flex-col items-center justify-center bg-[#f6f8fa] p-3 font-mono text-base'>
      <div className='container mx-auto flex w-full justify-between'>
        <div className='flex items-center'>
          <Link href={'/'} className='text-2xl text-black no-underline'>
            QA
          </Link>
        </div>
        <div className=' flex w-7/12'>
          <HeaderSearch />
          {session ? (
            <div className='flex items-center space-x-5 pl-5 pr-10'>
              <Notification notifications={notifications} />
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
              <Link href={'/questions/post'} className='no-underline'>
                <Button type='submit' className='bg-slate-500 hover:transform-none hover:bg-slate-600'>
                  投稿する
                </Button>
              </Link>
            </div>
          ) : (
            <div className='flex items-center space-x-5 px-10'>
              <Link href='/auth/login' className='no-underline'>
                <Button
                  type='submit'
                  className='rounded-lg border border-solid border-slate-300 bg-white text-black hover:transform-none hover:border-black hover:bg-white'
                >
                  ログイン
                </Button>
              </Link>
              <Link href='/auth/signup' className='no-underline'>
                <Button
                  type='submit'
                  className='rounded-lg bg-black hover:transform-none hover:bg-black hover:opacity-75'
                >
                  新規登録
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}