'use client'

import type { Session } from '@supabase/auth-helpers-nextjs'
import { useSetAtom } from 'jotai'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { displayMainNavNameAtom } from '@/store/navigation-atom'

import { mainNavigation } from './nav-list-data'

export const MainNavigation = ({ session }: { session: Session | null }) => {
  const pathname = usePathname()

  const setDisplayMainNavName = useSetAtom(displayMainNavNameAtom)

  const questionNav = [mainNavigation[0]]
  const authenticatedNavList = session ? mainNavigation : questionNav

  return (
    <div className='flex w-14 min-w-min flex-col overflow-y-hidden border-r p-2 min-h-screen h-full'>
      <Link className='block aspect-square' href={'/'}>
        <Image
          src={'/logo.png'}
          alt='QA-site-supabase'
          priority
          width={40}
          height={40}
          className='mx-auto cursor-pointer rounded'
        />
      </Link>
      <ul className='mt-5 flex flex-col items-center justify-center space-y-2'>
        {authenticatedNavList.map((item, index) => {
          return (
            <TooltipProvider key={index} delayDuration={100}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    onClick={() => {
                      if (item.name === '質問') setDisplayMainNavName('質問')
                      else if (item.name === '設定') setDisplayMainNavName('設定')
                    }}
                  >
                    <span
                      className={`${
                        item.hrefList.includes(pathname) && 'bg-muted hover:text-primary'
                      } hover:text-foreground' flex h-10 w-10 items-center justify-center rounded text-muted-foreground transition-colors duration-200 hover:bg-muted hover:text-primary`}
                    >
                      {<item.icon />}
                    </span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side='right' sideOffset={5} align='start'>
                  <p>{item.name}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )
        })}
      </ul>
    </div>
  )
}
