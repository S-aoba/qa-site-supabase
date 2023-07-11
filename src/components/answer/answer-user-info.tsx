'use client'
import Image from 'next/image'

import type { ProfileType } from '@/common/types'

export const AnswerUserInfo = ({ profile, created_at }: { profile: ProfileType | null; created_at: string }) => {
  return (
    <div className='flex items-center space-x-2'>
      <div className='relative h-6 w-6'>
        <Image
          src={profile && profile.avatar_url ? profile.avatar_url : '/default.png'}
          className='rounded-full object-cover'
          alt='avatar'
          fill
          sizes='auto'
          priority
        />
      </div>
      <div>
        <p className='text-sm'>{profile?.username}</p>
      </div>
      <div>
        <span className='text-sm'>投稿日: {created_at.slice(0, 10)}</span>
      </div>
    </div>
  )
}
