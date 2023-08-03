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
        <div
          className='prose prose-sm prose-slate break-words p-3 lg:prose'
          dangerouslySetInnerHTML={{ __html: answer.content }}
        />
      )}
    </div>
  )
}
