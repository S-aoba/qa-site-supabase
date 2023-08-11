'use client'

import { useAtomValue } from 'jotai'

import type { CommentType } from '@/common/types'
import { isCommentEditModeAtom } from '@/store/comment-atom'

import { CommentForm } from './comment-form'

export const CommentContent = ({ comment }: { comment: CommentType }) => {
  const isEditMode = useAtomValue(isCommentEditModeAtom)
  return (
    <>
      {isEditMode ? (
        <CommentForm commentId={comment.id} />
      ) : (
        comment && (
          <div
            className='prose prose-sm m-2 dark:prose-invert sm:prose-base focus:outline-none'
            dangerouslySetInnerHTML={{ __html: comment.content }}
          />
        )
      )}
    </>
  )
}
