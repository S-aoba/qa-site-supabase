'use client'
import { IconEdit, IconTrash } from '@tabler/icons-react'
import Image from 'next/image'

import type { CommentType } from '@/common/types'

export const Comment = async ({ comment, userId }: { comment: CommentType; userId: string | undefined }) => {
  return (
    <div className='border-b border-l-0 border-r-0 border-t-0 border-solid border-slate-300'>
      <div className='flex justify-between space-x-2 bg-[#d3e0ec] p-2'>
        <div className='flex space-x-2'>
          <div className='relative h-6 w-6'>
            <Image
              src={comment.avatar_url !== null ? comment?.avatar_url : '/default.png'}
              className='rounded-full object-cover'
              alt='avatar'
              fill
              sizes='auto'
              priority
            />
          </div>
          <span>{comment?.username}</span>
        </div>
        {userId && userId === comment.user_id ? (
          <div className='flex space-x-2'>
            <IconEdit className='text-slate-500 hover:cursor-pointer hover:text-slate-700' />
            <IconTrash className='text-slate-500 hover:cursor-pointer hover:text-slate-700' />
          </div>
        ) : null}
      </div>
      {comment && <div className='break-words px-2' dangerouslySetInnerHTML={{ __html: comment.content }} />}
    </div>
  )
}
