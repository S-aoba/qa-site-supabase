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
    <div className='border-t p-5'>
      <div>
        <span className='text-xl'>コメント</span>
      </div>
      <div className='mt-5 flex flex-col space-y-8'>
        {firstComment && <CommentBody comment={firstComment} session={session} />}
        {remainComment &&
          isDisplayComments &&
          remainComment.map((comment) => {
            return <CommentBody key={comment.id} comment={comment} session={session} />
          })}
      </div>
      {remainComment !== null && (
        <div className=' pt-3'>
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
