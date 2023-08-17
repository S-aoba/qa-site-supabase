'use client'

import type { Session } from '@supabase/auth-helpers-nextjs'
import { useAtom } from 'jotai'

import type { CommentType } from '@/common/types'
import { isDisplayCommentsAtom } from '@/store/comment-atom'

import { Button } from '../ui/button'
import { CommentBody } from './comment-body'

export const Comment = ({ comments, session }: { comments: CommentType[]; session: Session | null }) => {
  const [isDisplayComments, setIsDisplayComments] = useAtom(isDisplayCommentsAtom)

  const commentLength = comments.length
  const firstComment = commentLength === 0 ? null : comments[0]
  const remainComment = commentLength > 1 ? comments.slice(1, commentLength) : null

  const handleToggleComment = () => {
    if (isDisplayComments) setIsDisplayComments(false)
    else setIsDisplayComments(true)
  }

  return (
    <div>
      <div className='h-6 border-t border-input pb-10 pl-4 pt-2 text-primary dark:brightness-75'>
        <p >コメント</p>
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
            <span className='text-sm text-foreground'>
              {isDisplayComments ? '閉じる' : `あと${remainComment.length}コメントがあります`}
            </span>
          </Button>
        </div>
      )}
    </div>
  )
}
