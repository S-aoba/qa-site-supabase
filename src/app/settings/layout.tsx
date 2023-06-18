'use client'

import { IconKey, IconLogout2, IconMailForward, IconUserCircle } from '@tabler/icons-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

// ナビゲーション
const subNavigation = [
  {
    name: 'プロフィール',
    icon: IconUserCircle,
    href: '/settings/profile',
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

  return (
    <div className='grid grid-cols-3 gap-3'>
      <div className='col-span-1 flex flex-col space-y-1 text-sm font-bold'>
        {subNavigation.map((item, index) => {
          return (
            <Link href={item.href} key={index}>
              <div
                className={`${
                  item.href == pathname && 'bg-sky-100 text-sky-500'
                } rounded-full px-3 py-2 hover:bg-sky-100`}
              >
                <item.icon className='mr-2 inline-block h-5 w-5' />
                {item.name}
              </div>
            </Link>
          )
        })}
      </div>
      <div className='col-span-2'>{children}</div>
    </div>
  )
}

export default SettingsLayout
