'use client'

import { useAtomValue } from 'jotai'

import type { AnswerType } from '@/common/types'
import { isAnswerEditModeAtom } from '@/store/answer-atom'

import { AnswerUpdateForm } from './answer-update-form'

export const AnswerContent = ({ answer }: { answer: AnswerType }) => {
  const isEditMode = useAtomValue(isAnswerEditModeAtom)

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
