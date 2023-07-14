'use client'

import type { Session } from '@supabase/auth-helpers-nextjs'
import { Provider as JotaiProvider } from 'jotai'
import type { ReactNode } from 'react'

import type { CommentType, ProfileType } from '@/common/types'

import { CommentActions } from './comment-actions'
import { CommentContent } from './comment-content'

export const CommentBody = ({
  comment,
  profile,
  session,
  children,
}: {
  comment: CommentType
  profile: ProfileType | null
  session: Session | null
  children: ReactNode
}) => {
  return (
    <JotaiProvider>
      <div className='border-b-0 border-l-0 border-r-0 border-t border-solid border-slate-300'>
        <div className='flex justify-between space-x-2 bg-[#d3e0ec] p-2'>
          {children}
          {session && <CommentActions profile={profile} comment={comment} />}
        </div>
        <CommentContent comment={comment} />
      </div>
    </JotaiProvider>
  )
}
