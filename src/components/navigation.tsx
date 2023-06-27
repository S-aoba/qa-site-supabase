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
    <div className='flex w-full justify-center border-b border-l-0 border-r-0 border-t-0 border-solid border-slate-200 bg-[#f6f8fa] pb-2'>
      <div className=' flex w-full max-w-[800px] space-x-2 px-3 text-sm font-bold'>
        {subNavigation.map((item, index) => {
          return (
            <Link key={index} href={item.href} className='font-normal text-slate-500 no-underline'>
              <div
                className={`${
                  item.href == pathname && 'bg-slate-700 text-slate-50 hover:text-slate-50'
                } flex items-center rounded-full px-3 py-2 hover:bg-slate-700 hover:text-white`}
              >
                <item.icon className='mr-2 inline-block h-5 w-5' />
                {item.name}
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
