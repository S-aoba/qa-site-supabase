import type { NextPage } from 'next'
import Image from 'next/image'

type QuestionUserInfoProps = {
  created_at: string
  avatar_url: string | null
  username: string
  coding_problem: string
}
export const QuestionUserInfo: NextPage<QuestionUserInfoProps> = ({
  created_at,
  avatar_url,
  username,
  coding_problem,
}) => {
  return (
    <div className='flex items-center space-x-2'>
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
      <p className='text-sm'>{username}</p>
      <span className='text-sm'>投稿日: {created_at.slice(0, 10)}</span>
      <span className='line-clamp-1 w-fit max-w-[500px] rounded-lg bg-slate-500 px-2 py-1 text-sm leading-5 text-stone-50'>
        {coding_problem}
      </span>
    </div>
  )
}
