'use client'

import type { Session } from '@supabase/auth-helpers-nextjs'
import { useState } from 'react'

import type { AnswerType, CommentType } from '@/common/types'

import { CommentBody } from './comment-body'
import { CommentCreateForm } from './comment-create-form'

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

  const handleOpenComment = () => {
    setIsDisplayComments(true)
  }

  const handleCloseComment = () => {
    setIsDisplayComments(false)
  }
  return (
    <div>
      {comments.length > 0 ? (
        isDisplayComments ? (
          comments.map((comment) => {
            return <CommentBody key={comment.id} comment={comment} session={session} />
          })
        ) : (
          <div className='border-b-0 border-l-0 border-r-0 border-t border-solid border-slate-300 text-end font-semibold text-slate-400 hover:cursor-pointer hover:text-slate-600 hover:underline hover:underline-offset-2'>
            <span className='inline-block p-2' onClick={handleOpenComment}>
              コメントを表示する
            </span>
          </div>
        )
      ) : null}
      {isDisplayComments && (
        <div className='border-b-0 border-l-0 border-r-0 border-t border-solid border-slate-300 text-end font-semibold text-slate-400 hover:cursor-pointer hover:text-slate-600 hover:underline hover:underline-offset-2'>
          <span className='inline-block p-2' onClick={handleCloseComment}>
            コメントを非表示にする
          </span>
        </div>
      )}
      {session && <CommentCreateForm answer={answer} />}
    </div>
  )
}
