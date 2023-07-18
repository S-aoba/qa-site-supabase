'use client'

import type { Session } from '@supabase/auth-helpers-nextjs'
import { Provider as JotaiProvider } from 'jotai'

import type { CommentType } from '@/common/types'

import { CommentActions } from './comment-actions'
import { CommentContent } from './comment-content'
import { CommentUserInfo } from './comment-user-info'

export const CommentBody = ({ comment, session }: { comment: CommentType; session: Session | null }) => {
  return (
    <JotaiProvider>
      <div className='border-b-0 border-l-0 border-r-0 border-t border-solid border-slate-300'>
        <div className='flex justify-between space-x-2 bg-[#d3e0ec] p-2'>
          <CommentUserInfo
            avatar_url={comment.avatar_url}
            username={comment.username}
            created_at={comment.created_at}
            updated_at={comment.updated_at}
          />
          {session && session.user.id === comment.user_id && <CommentActions comment={comment} />}
        </div>
        <CommentContent comment={comment} />
      </div>
    </JotaiProvider>
  )
}
