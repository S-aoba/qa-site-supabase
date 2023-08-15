import type { NextPage } from 'next'
import Image from 'next/image'

type Props = {
  created_at: string
  updated_at: string
  avatar_url: string | null
  username: string | null
} & {
  coding_problem?: string
}

export const UserInfo: NextPage<Props> = ({ ...props }) => {
  return (
    <div className='flex items-center space-x-2 p-2 text-sm text-primary dark:brightness-75 '>
      <div className='relative h-8 w-8'>
        <Image
          src={props.avatar_url ? props.avatar_url : '/default.png'}
          className='rounded-full object-cover'
          alt='avatar'
          fill
          sizes='auto'
          priority
        />
      </div>
      <p className='max-w-[150px] flex-nowrap truncate'>{props.username}</p>
      <div className='flex items-center space-x-2'>
        {props.created_at !== props.updated_at && (
          <span className='truncate px-2'>更新日: {props.updated_at.slice(0, 10)}</span>
        )}
        <span className='truncate px-2'>投稿日: {props.created_at.slice(0, 10)}</span>
        {props.coding_problem && (
          <span className='w-fit max-w-[300px] truncate rounded bg-accent-foreground px-2 py-1 text-accent'>
            {props.coding_problem}
          </span>
        )}
      </div>
    </div>
  )
}
