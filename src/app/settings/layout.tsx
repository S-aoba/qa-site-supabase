'use client'

import {
  IconHelpHexagon,
  IconKey,
  IconLogout2,
  IconMailForward,
  IconMessageCircle,
  IconUserCircle,
} from '@tabler/icons-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { useWindowSize } from '@/common/hooks/useWindowSize'

// ナビゲーション
const subNavigation = [
  {
    name: 'プロフィール',
    icon: IconUserCircle,
    href: '/settings/profile',
  },
  {
    name: '自分の質問',
    icon: IconHelpHexagon,
    href: '/settings/my-questions',
  },
  {
    name: '回答した質問',
    icon: IconMessageCircle,
    href: '/settings/questions-answered',
  },
  {
    name: 'メールアドレス',
    icon: IconMailForward,
    href: '/settings/email',
  },
  {
    name: 'パスワード',
    icon: IconKey,
    href: '/settings/password',
  },
  {
    name: 'ログアウト',
    icon: IconLogout2,
    href: '/settings/logout',
  },
]

// レイアウト
const SettingsLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname()
  const [width] = useWindowSize()

  return (
    <>
      {width >= 1019 ? (
        <div className='grid grid-cols-12 gap-3'>
          <div className='col-span-2 flex flex-col space-y-1 text-sm font-bold'>
            {subNavigation.map((item, index) => {
              return (
                <Link
                  href={item.href}
                  key={index}
                  className={`${
                    item.href == pathname && 'border hover:bg-white'
                  } flex items-center justify-start rounded-full px-3 py-2 hover:bg-slate-200`}
                >
                  <item.icon className='mr-2 inline-block h-5 w-5' />
                  {item.name}
                </Link>
              )
            })}
          </div>
          <div className='col-span-10'>{children}</div>
        </div>
      ) : (
        <div className='flex w-full flex-col'>
          <div className='flex w-full space-x-2 overflow-x-scroll pb-5 text-sm'>
            {subNavigation.map((item, index) => {
              return (
                <Link
                  href={item.href}
                  key={index}
                  className={`${
                    item.href == pathname && 'border border-solid hover:bg-white'
                  } flex min-w-fit flex-col items-center justify-start rounded-full px-3 py-2`}
                >
                  <item.icon className='mr-2 inline-block h-5 w-5' />
                  {item.name}
                </Link>
              )
            })}
          </div>
          <div className='pt-4'>{children}</div>
        </div>
      )}
    </>
  )
}

export default SettingsLayout
