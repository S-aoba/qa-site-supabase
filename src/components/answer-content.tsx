import type { AnswerType } from '@/common/types'

import { AnswerUpdateForm } from './answer-update-form'

export const Content = ({
  answer,
  isEditMode,
  userId,
}: {
  answer: AnswerType
  isEditMode: boolean
  userId: string | undefined
}) => {
  return (
    <div className='border-b border-l-0 border-r-0 border-t-0 border-solid border-slate-300'>
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
