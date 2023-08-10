'use client'

import type { Session } from '@supabase/supabase-js'
import { useAtom, useAtomValue } from 'jotai'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

import type { ProfileType } from '@/common/types'
import { displayMainNavNameAtom } from '@/store/naigation-atom'
import { profileAtom } from '@/store/profile-atom'

import { subQuestionNavigation, subSettingNavigation } from './nav-list-data'

export const SubNavigation = ({ session, profile }: { session: Session | null; profile: ProfileType | null }) => {
  const pathname = usePathname()

  const [_, setUser] = useAtom(profileAtom)
  const displayMainNavName = useAtomValue(displayMainNavNameAtom)

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
    <div className='hide-scrollbar flex w-64 flex-col'>
      <div
        className='flex max-h-12 items-center justify-start space-x-2 border-b px-6'
        style={{
          minHeight: '3rem',
        }}
      >
        <p className='text-lg'>{displayMainNavName === '質問' ? displayMainNavName : '設定'}</p>
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
                {displayMainNavName === '質問'
                  ? subQuestionNavigation.map((item, index) => {
                      return (
                        <Link
                          key={index}
                          href={item.href}
                          className={`${
                            item.href === pathname && 'bg-muted hover:text-primary'
                          } hover:text-foreground' flex h-10 w-full items-center justify-start space-x-2 rounded px-3 text-muted-foreground transition-colors duration-200 hover:text-primary`}
                        >
                          {<item.icon size={20} />}
                          <span>{item.name}</span>
                        </Link>
                      )
                    })
                  : subSettingNavigation.map((item, index) => {
                      return (
                        <Link
                          key={index}
                          href={item.href}
                          className={`${
                            item.href === pathname && 'bg-muted hover:text-primary'
                          } hover:text-foreground' flex h-10 w-full items-center justify-start space-x-2 rounded px-3 text-muted-foreground transition-colors duration-200 hover:text-primary`}
                        >
                          {<item.icon size={20} />}
                          <span>{item.name}</span>
                        </Link>
                      )
                    })}
              </div>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  )
}
