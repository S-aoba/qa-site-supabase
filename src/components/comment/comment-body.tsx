import type { Session } from '@supabase/auth-helpers-nextjs'
import { Provider as JotaiProvider } from 'jotai'

import type { CommentType } from '@/common/types'

import { Action } from '../ui/action'
import { UserInfo } from '../ui/user-info'
import { CommentContent } from './comment-content'

export const CommentBody = ({ comment, session }: { comment: CommentType; session: Session | null }) => {
  return (
    <JotaiProvider>
      <div className='border-t'>
        <div className='rounded-t-lg border-b px-2'>
          <div className='flex justify-between'>
            <UserInfo
              created_at={comment.created_at}
              updated_at={comment.updated_at}
              avatar_url={comment.avatar_url}
              username={comment.username}
            />
            {session && session.user.id === comment.user_id && <Action type='default' comment={comment} />}
          </div>
        </div>
        <CommentContent comment={comment} />
      </div>
    </JotaiProvider>
  )
}
