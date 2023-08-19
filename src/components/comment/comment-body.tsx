import type { Session } from '@supabase/auth-helpers-nextjs'
import { Provider as JotaiProvider } from 'jotai'

import type { CommentType } from '@/common/types'

import { Action } from '../ui/action'
import { UserInfo } from '../ui/user-info'
import { CommentContent } from './comment-content'

export const CommentBody = ({ comment, session }: { comment: CommentType; session: Session | null }) => {
  return (
    <JotaiProvider>
      <div className='flex flex-col space-y-2 border-b-2 border-slate-300 bg-background pb-5 pt-2'>
        <div className='flex justify-between overflow-x-hidden px-2'>
          <UserInfo
            created_at={comment.created_at}
            updated_at={comment.updated_at}
            avatar_url={comment.avatar_url}
            username={comment.username}
          />
          {session && session.user.id === comment.user_id && <Action comment={comment} />}
        </div>
        <CommentContent comment={comment} />
      </div>
    </JotaiProvider>
  )
}
