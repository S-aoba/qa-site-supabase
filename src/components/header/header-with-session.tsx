import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'

import { Button } from '../ui/button'

export const HeaderWithSession = ({ avatar_url, children }: { avatar_url: string | null; children: ReactNode }) => {
  return (
    <>
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
      <Button type='button' variant='outline' asChild>
        <Link href={'/questions/post'}>質問する</Link>
      </Button>
    </>
  )
}
