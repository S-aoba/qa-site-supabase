'use client'

import type { Session } from '@supabase/supabase-js'
import {
  IconAt,
  IconFriends,
  IconLogout,
  IconMail,
  IconMessage,
  IconPassword,
  IconUserCircle,
  IconUserQuestion,
} from '@tabler/icons-react'
import { useAtom, useAtomValue } from 'jotai'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

import type { NotificationType, ProfileType } from '@/common/types'
import { displayMainNavNameAtom } from '@/store/naigation-atom'
import { profileAtom } from '@/store/profile-atom'

export const Header = ({
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

const subQuestionNavigation = [
  {
    name: '新着の質問',
    icon: IconFriends,
    href: '/',
  },
  {
    name: '回答募集中',
    icon: IconAt,
    href: '/question-waiting-answers',
  },
  {
    name: '自分の質問',
    icon: IconUserQuestion,
    href: '/settings/my-questions',
  },
  {
    name: '自分の回答',
    icon: IconMessage,
    href: '/settings/questions-answered',
  },
]

const subSettingNavigation = [
  {
    name: 'プロフィール',
    icon: IconUserCircle,
    href: '/settings/profile',
  },
  {
    name: 'メールアドレス',
    icon: IconMail,
    href: '/settings/email',
  },
  {
    name: 'パスワード',
    icon: IconPassword,
    href: '/settings/password',
  },
  {
    name: 'ログアウト',
    icon: IconLogout,
    href: '/settings/logout',
  },
]
