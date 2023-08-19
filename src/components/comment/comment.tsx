'use client'

import type { Session } from '@supabase/auth-helpers-nextjs'

import type { CommentType } from '@/common/types'

import { Button } from '../ui/button'
import { CommentBody } from './comment-body'
import { useComment } from './useComment'

export const Comment = ({ comments, session }: { comments: CommentType[]; session: Session | null }) => {
  const commentLength = comments.length
  const firstComment = commentLength === 0 ? null : comments[0]
  const remainComment = commentLength > 1 ? comments.slice(1, commentLength) : null

  const { isDisplayComments, handleToggleComment } = useComment()

  return (
    <div>
      <div className='h-6 border-t border-input pb-10 pl-4 pt-2 text-primary dark:brightness-75'>
        <p>コメント</p>
      </div>
      {firstComment && <CommentBody comment={firstComment} session={session} />}
      {remainComment &&
        isDisplayComments &&
        remainComment.map((comment) => {
          return <CommentBody key={comment.id} comment={comment} session={session} />
        })}
      {remainComment !== null && (
        <div className='border-t border-input p-2'>
          <Button variant={'ghost'} asChild onClick={handleToggleComment}>
            <span className='text-sm text-foreground hover:underline hover:underline-offset-2'>
              {isDisplayComments ? '閉じる' : `あと${remainComment.length}件コメントがあります`}
            </span>
          </Button>
        </div>
      )}
    </div>
  )
}
