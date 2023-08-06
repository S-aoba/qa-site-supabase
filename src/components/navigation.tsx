'use client'

import { IconCampfire, IconHelpHexagonFilled } from '@tabler/icons-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

// ナビゲーション
const subNavigation = [
  {
    name: '新着',
    icon: IconHelpHexagonFilled,
    href: '/',
  },
  {
    name: '回答募集中',
    icon: IconCampfire,
    href: '/question-waiting-answers',
  },
]

export const Navigation = () => {
  const pathname = usePathname()

  return (
    <div className='flex w-full justify-center border-b border-l-0 border-r-0 border-t-0 border-solid border-slate-200'>
      <div className=' flex w-full max-w-[800px] space-x-2 px-3 text-sm font-bold'>
        {subNavigation.map((item, index) => {
          return (
            <Link
              key={index}
              href={item.href}
              className={`${
                item.href == pathname &&
                'border-b-2 border-l-0 border-r-0 border-t-0 border-solid border-slate-900 text-slate-800 hover:text-slate-800'
              } flex items-center px-3 py-2 text-slate-500 no-underline hover:text-slate-800`}
            >
              {item.name}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
