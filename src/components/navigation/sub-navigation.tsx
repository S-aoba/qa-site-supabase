'use client'

import type { Session } from '@supabase/supabase-js'
import { useAtom, useAtomValue } from 'jotai'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

import type { NotificationType, ProfileType } from '@/common/types'
import { displayMainNavNameAtom } from '@/store/navigation-atom'
import { profileAtom } from '@/store/profile-atom'

import { Notification } from '../notification/notification'
import { Button } from '../ui/button'
import { shouldShowNavList, subQuestionNavigation, subSettingNavigation } from './nav-list-data'
import { Tab } from './tab'

export const SubNavigation = ({
  session,
  profile,
  notifications,
}: {
  session: Session | null
  profile: ProfileType | null
  notifications: NotificationType[] | null
}) => {
  const pathname = usePathname()

  const [user, setUser] = useAtom(profileAtom)
  const displayMainNavName = useAtomValue(displayMainNavNameAtom)

  const navList = displayMainNavName === '質問' ? subQuestionNavigation : subSettingNavigation

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
    <>
      {shouldShowNavList.includes(pathname) && (
        <div className='hide-scrollbar flex w-64 flex-col'>
          <div
            className='flex max-h-12 items-center justify-between space-x-2 border-b px-6'
            style={{
              minHeight: '3rem',
            }}
          >
            <p className='text-lg'>{displayMainNavName === '質問' ? displayMainNavName : '設定'}</p>
            {session && <Notification notifications={notifications} />}
          </div>
          <div
            className='flex max-h-12 items-center justify-between space-x-2 border-b px-6'
            style={{
              minHeight: '3rem',
            }}
          >
            {session ? (
              <>
                <Link href='/settings/profile'>
                  <div className='relative h-8 w-8'>
                    <Image
                      src={user.avatar_url ? user.avatar_url : '/default.png'}
                      className='rounded-full object-cover'
                      alt='avatar'
                      fill
                      sizes='auto'
                      priority
                    />
                  </div>
                </Link>
                <Button type='button' variant='outline' asChild>
                  <Link href={'/questions/post'}>質問する</Link>
                </Button>
              </>
            ) : (
              <>
                <Button variant='outline' asChild>
                  <Link href='/auth/login'>ログイン</Link>
                </Button>
                <Button variant='default' asChild>
                  <Link href='/auth/signup'>新規登録</Link>
                </Button>
              </>
            )}
          </div>
          <div
            className='flex-grow overflow-y-auto'
            style={{
              maxHeight: `calc(100vh - 96px)`,
            }}
          >
            <div
              className='flex h-full flex-grow flex-col pt-5'
              style={{
                maxHeight: `calc(100vh - 48px)`,
              }}
            >
              <nav
                aria-label='Sidebar'
                aria-labelledby='options-menu'
                className='flex flex-auto space-y-6 px-4 pb-4 text-sm'
              >
                <ul className='flex flex-auto flex-col'>
                  <div className='flex flex-1 flex-col space-y-2'>
                    {navList.map((item, index) => {
                      return (
                        <Tab key={index} href={item.href} name={item.name} pathname={pathname} icon={<item.icon />} />
                      )
                    })}
                  </div>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
