'use client'

import Image from 'next/image'
import { useState } from 'react'

import type { CommentType } from '@/common/types'

import { CommentActions } from './comment-actions'
import { CommentUpdateForm } from './comment-update-form'

export const Comment = ({ comment, userId }: { comment: CommentType; userId: string | undefined }) => {
  const [isEditMode, setIsEditMode] = useState(false)
  const [message, setMessage] = useState('')

  return (
    <div className='border-b-0 border-l-0 border-r-0 border-t border-solid border-slate-300'>
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
        <CommentActions
          userId={userId}
          comment={comment}
          isEditMode={isEditMode}
          setIsEditMode={setIsEditMode}
          setMessage={setMessage}
        />
      </div>
      {isEditMode ? (
        <CommentUpdateForm commentId={comment.id} />
      ) : (
        comment && <div className='break-words px-2' dangerouslySetInnerHTML={{ __html: comment.content }} />
      )}
      {message && <div className='my-5 text-center text-sm text-red-500'>{message}</div>}
    </div>
  )
}
