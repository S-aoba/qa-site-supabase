'use client'

import type { Session } from '@supabase/auth-helpers-nextjs'
import { useSetAtom } from 'jotai'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { displayMainNavNameAtom } from '@/store/naigation-atom'

import { mainNavigation, shouldShowNavList } from './nav-list-data'

export const MainNavigation = ({ session }: { session: Session | null }) => {
  const pathname = usePathname()

  const setDisplayMainNavName = useSetAtom(displayMainNavNameAtom)

  return (
    <>
      {shouldShowNavList.includes(pathname) && (
        <div className='flex w-14 flex-col overflow-y-hidden border-r p-2'>
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
            {mainNavigation.map((item, index) => {
              return (
                <>
                  {!session && item.name === '設定' ? null : (
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
                  )}
                </>
              )
            })}
          </ul>
        </div>
      )}
    </>
  )
}
