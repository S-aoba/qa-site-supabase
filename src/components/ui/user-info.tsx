import type { NextPage } from 'next'
import Image from 'next/image'

type Props = {
  created_at: string
  updated_at: string
  avatar_url: string | null
  username: string
} & {
  coding_problem?: string
}

export const UserInfo: NextPage<Props> = ({ ...props }) => {
  return (
    <div className='flex items-center space-x-2 py-2 text-sm'>
      <div className='relative h-6 w-6'>
        <Image
          src={props.avatar_url ? props.avatar_url : '/default.png'}
          className='rounded-full object-cover'
          alt='avatar'
          fill
          sizes='auto'
          priority
        />
      </div>
      <p className='max-w-[150px] truncate'>{props.username}</p>
      <div className='flex flex-col space-y-2 md:flex-row md:items-center md:space-x-2 md:space-y-0'>
        {props.created_at !== props.updated_at && <span className='px-2'>更新日: {props.updated_at.slice(0, 10)}</span>}
        <span className='px-2'>投稿日: {props.created_at.slice(0, 10)}</span>
        {props.coding_problem && (
          <span className='line-clamp-1 w-fit max-w-[500px] rounded-lg px-2 py-1 text-sm leading-5'>
            {props.coding_problem}
          </span>
        )}
      </div>
    </div>
  )
}
