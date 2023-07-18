import type { NextPage } from 'next'
import Image from 'next/image'

type QuestionUserInfoProps = {
  created_at: string
  updated_at: string
  avatar_url: string | null
  username: string
  coding_problem: string
}
export const QuestionUserInfo: NextPage<QuestionUserInfoProps> = ({
  created_at,
  updated_at,
  avatar_url,
  username,
  coding_problem,
}) => {
  return (
    <div className='flex items-center space-x-2 py-2 text-sm md:py-0'>
      <div className='relative h-6 w-6'>
        <Image
          src={avatar_url ? avatar_url : '/default.png'}
          className='rounded-full object-cover'
          alt='avatar'
          fill
          sizes='auto'
          priority
        />
      </div>
      <p className='max-w-[150px] truncate'>{username}</p>
      <div className='flex flex-col space-y-2 md:flex-row md:items-center md:space-x-2 md:space-y-0'>
        {created_at !== updated_at && <span className='px-2'>更新日: {updated_at.slice(0, 10)}</span>}
        <span className='px-2'>投稿日: {created_at.slice(0, 10)}</span>
        <span className='line-clamp-1 w-fit max-w-[500px] rounded-lg bg-slate-500 px-2 py-1 text-sm leading-5 text-stone-50'>
          {coding_problem}
        </span>
      </div>
    </div>
  )
}
