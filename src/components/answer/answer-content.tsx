'use client'

import type { AnswerType } from '@/common/types'

import { AnswerUpdateForm } from './answer-update-form'

export const AnswerContent = ({ answer, isEditMode }: { answer: AnswerType; isEditMode: boolean }) => {
  return (
    <div>
      {isEditMode ? (
        <div className='p-3'>
          <AnswerUpdateForm answerId={answer.id} />
        </div>
      ) : (
        <div className='break-words p-3' dangerouslySetInnerHTML={{ __html: answer.content }} />
      )}
    </div>
  )
}
