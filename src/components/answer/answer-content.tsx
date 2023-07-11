import type { AnswerType } from '@/common/types'

import { AnswerUpdateForm } from './answer-update-form'

export const AnswerContent = ({
  answer,
  isEditMode,
  userId,
}: {
  answer: AnswerType
  isEditMode: boolean
  userId: string | undefined
}) => {
  return (
    <div>
      {isEditMode
        ? userId && (
            <div className='p-3'>
              <AnswerUpdateForm answerId={answer.id} />
            </div>
          )
        : answer && <div className='break-words p-3' dangerouslySetInnerHTML={{ __html: answer.content }} />}
    </div>
  )
}
