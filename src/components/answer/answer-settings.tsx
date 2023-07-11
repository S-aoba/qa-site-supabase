import type { Dispatch, SetStateAction } from 'react'

import type { AnswerType, ProfileType } from '@/common/types'

import { AnswerActions } from './answer-actions'
import { AnswerUserInfo } from './answer-user-info'

export const AnswerSettings = ({
  answer,
  userId,
  profile,
  isEditMode,
  setIsEditMode,
}: {
  answer: AnswerType
  userId: string | undefined
  profile: ProfileType | null
  isEditMode: boolean
  setIsEditMode: Dispatch<SetStateAction<boolean>>
}) => {
  return (
    <div className='rounded-t-lg border-b border-l-0 border-r-0 border-t-0 border-solid border-slate-300 bg-[#f6f8fa] px-2'>
      <div className='flex justify-between'>
        <AnswerUserInfo profile={profile} created_at={answer.created_at} />
        <AnswerActions userId={userId} answer={answer} isEditMode={isEditMode} setIsEditMode={setIsEditMode} />
      </div>
    </div>
  )
}
