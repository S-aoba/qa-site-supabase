import type { Session } from '@supabase/auth-helpers-nextjs'
import { Provider as JotaiProvider } from 'jotai'

import type { CommentType } from '@/common/types'

import { Action } from '../ui/action'
import { UserInfo } from '../ui/user-info'
import { CommentContent } from './comment-content'

export const CommentBody = ({ comment, session }: { comment: CommentType; session: Session | null }) => {
  return (
    <JotaiProvider>
      <div>
        <div className='border-y'>
          <div className='flex justify-between px-2 overflow-x-hidden'>
            <UserInfo
              created_at={comment.created_at}
              updated_at={comment.updated_at}
              avatar_url={comment.avatar_url}
              username={comment.username}
            />
            {session && session.user.id === comment.user_id && <Action comment={comment} />}
          </div>
        </div>
        <CommentContent comment={comment} />
      </div>
    </JotaiProvider>
  )
}
