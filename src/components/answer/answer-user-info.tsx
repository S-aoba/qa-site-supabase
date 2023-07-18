import Image from 'next/image'

import type { ProfileType } from '@/common/types'

export const AnswerUserInfo = ({
  profile,
  created_at,
  updated_at,
}: {
  profile: ProfileType | null
  created_at: string
  updated_at: string
}) => {
  return (
    <div className='flex items-center space-x-2 py-2'>
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
        <p className='max-w-[150px] truncate text-sm'>{profile?.username}</p>
      </div>
      <div className='flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:items-center sm:space-y-0'>
        {created_at !== updated_at && <span className='text-sm'>更新日: {updated_at.slice(0, 10)}</span>}
        <span className='text-sm'>投稿日: {created_at.slice(0, 10)}</span>
      </div>
    </div>
  )
}
