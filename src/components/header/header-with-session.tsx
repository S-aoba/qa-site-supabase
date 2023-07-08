import { Button } from '@mantine/core'
import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'

export const HeaderWithSession = ({ avatar_url, children }: { avatar_url: string | null; children: ReactNode }) => {
  return (
    <div className='flex items-center space-x-5 pl-5 pr-10'>
      {children}
      <Link href='/settings/profile'>
        <div className='relative h-10 w-10'>
          <Image
            src={avatar_url ? avatar_url : '/default.png'}
            className='rounded-full object-cover'
            alt='avatar'
            fill
            sizes='auto'
            priority
          />
        </div>
      </Link>
      <Link href={'/questions/post'} className='no-underline'>
        <Button type='submit' className='bg-slate-500 hover:transform-none hover:bg-slate-600'>
          投稿する
        </Button>
      </Link>
    </div>
  )
}
