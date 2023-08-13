'use client'

import { useAtomValue } from 'jotai'

import type { AnswerType } from '@/common/types'
import { isAnswerEditModeAtom } from '@/store/answer-atom'

import { AnswerForm } from './answer-form'

export const AnswerContent = ({ answer }: { answer: AnswerType }) => {
  const isEditMode = useAtomValue(isAnswerEditModeAtom)

  return (
    <div>
      {isEditMode ? (
        <div className='p-3'>
          <AnswerForm answerId={answer.id} />
        </div>
      ) : (
        <div
          className='prose prose-sm m-2 pb-2 pl-5 dark:prose-invert sm:prose-base focus:outline-none text-primary dark:brightness-75'
          dangerouslySetInnerHTML={{ __html: answer.content }}
        />
      )}
    </div>
  )
}
