'use client'

import type { Session } from '@supabase/auth-helpers-nextjs'
import { useState } from 'react'

import type { AnswerType, CommentType } from '@/common/types'

import { Button } from '../ui/button'
import { CommentBody } from './comment-body'
import { CommentForm } from './comment-form'

export const Comment = ({
  comments,
  answer,
  session,
}: {
  comments: CommentType[]
  answer: AnswerType
  session: Session | null
}) => {
  const [isDisplayComments, setIsDisplayComments] = useState(false)

  const firstComment = comments[0]
  const commentLength = comments.length
  const remainComment = commentLength > 1 ? comments.slice(1, commentLength) : null

  const handleToggleComment = () => {
    if (isDisplayComments) setIsDisplayComments(false)
    else setIsDisplayComments(true)
  }

  return (
    <div>
      <div className='h-6 border-t border-input pb-10 pl-2 pt-2'>
        <p className='text-foreground'>コメント</p>
      </div>
      <CommentBody comment={firstComment} session={session} />
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

      {session && <CommentForm answer={answer} />}
    </div>
  )
}
