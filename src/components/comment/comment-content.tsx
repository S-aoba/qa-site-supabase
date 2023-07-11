'use client'

import type { CommentType } from '@/common/types'

import { CommentUpdateForm } from './comment-update-form'

export const CommentContent = ({ isEditMode, comment }: { isEditMode: boolean; comment: CommentType }) => {
  return (
    <>
      {isEditMode ? (
        <CommentUpdateForm commentId={comment.id} />
      ) : (
        comment && <div className='break-words px-2' dangerouslySetInnerHTML={{ __html: comment.content }} />
      )}
    </>
  )
}
