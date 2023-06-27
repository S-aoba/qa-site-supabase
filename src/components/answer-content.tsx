import type { AnswerType, EditType } from '@/common/types'

import { AnswerUpdateForm } from './answer-update-form'

export const Content = ({
  answer,
  isEditMode,
  userId,
}: {
  answer: AnswerType
  isEditMode: EditType
  userId: string | undefined
}) => {
  return (
    <>
      {isEditMode.answer
        ? userId && (
            <div className='p-3'>
              <AnswerUpdateForm answerId={answer.id} />
            </div>
          )
        : answer && <div className='break-words p-3' dangerouslySetInnerHTML={{ __html: answer.content }} />}
    </>
  )
}
