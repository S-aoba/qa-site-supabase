'use client'

import type { Session } from '@supabase/auth-helpers-nextjs'
import { useState } from 'react'

import type { CommentType, ProfileType } from '@/common/types'

import { CommentActions } from './comment-actions'
import { CommentContent } from './comment-content'
import { CommentUserInfo } from './comment-user-info'

export const CommentBody = ({
  comment,
  profile,
  session,
}: {
  comment: CommentType
  profile: ProfileType | null
  session: Session | null
}) => {
  // const [isEditMode, setIsEditMode] = useState(false)
  const [message, setMessage] = useState('')

  return (
    <div className='border-b-0 border-l-0 border-r-0 border-t border-solid border-slate-300'>
      <div className='flex justify-between space-x-2 bg-[#d3e0ec] p-2'>
        <CommentUserInfo avatar_url={comment.avatar_url} username={comment.username} />
        {session && <CommentActions profile={profile} comment={comment} setMessage={setMessage} />}
      </div>
      <CommentContent comment={comment} />
      {message && <div className='my-5 text-center text-sm text-red-500'>{message}</div>}
    </div>
  )
}
