'use client'

import type { Session } from '@supabase/auth-helpers-nextjs'
import Image from 'next/image'
import Link from 'next/link'

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

import { Theme } from '../theme'
import { useNavigation } from './useNavigation'

export const MainNavigation = ({ session }: { session: Session | null }) => {
  const { pathname, setDisplayMainNavName, navigationListener } = useNavigation()

  const authenticatedNavList = navigationListener(session)

  return (
    <div className='flex w-14 flex-col justify-between overflow-y-hidden border-r p-2'>
      <div className='flex flex-col space-y-2'>
        <Link className='block aspect-square' href={'/'}>
          <Image
            src={'/logo.png'}
            alt='QA-site-supabase'
            priority
            width={50}
            height={50}
            className='mx-auto cursor-pointer rounded'
          />
        </Link>
        <div className='flex h-full flex-col justify-between'>
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
                            item.hrefList.includes(pathname) && 'bg-muted text-card-foreground hover:text-primary'
                          } flex h-10 w-10 items-center justify-center rounded text-card-foreground transition-colors duration-300 hover:bg-muted hover:text-primary`}
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
      </div>
      <Theme />
    </div>
  )
}
