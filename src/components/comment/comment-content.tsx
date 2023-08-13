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
            className='prose prose-sm m-2 pb-2 pl-5 dark:prose-invert sm:prose-base focus:outline-none text-primary dark:brightness-75'
            dangerouslySetInnerHTML={{ __html: comment.content }}
          />
        )
      )}
    </>
  )
}
