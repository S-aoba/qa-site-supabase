'use client'

import type { Session } from '@supabase/auth-helpers-nextjs'
import { useAtomValue } from 'jotai'

import type { AnswerType, ProfileType } from '@/common/types'
import { isAnswerEditModeAtom } from '@/store/answer-atom'

import { AnswerActions } from './answer-actions'
import { AnswerContent } from './answer-content'
import { AnswerUserInfo } from './answer-user-info'

export const AnswerBody = ({
  answer,
  profile,
  session,
}: {
  answer: AnswerType
  profile: ProfileType | null
  session: Session | null
}) => {
  const isEditMode = useAtomValue(isAnswerEditModeAtom)

  return (
    <>
      <div className='rounded-t-lg border-b border-l-0 border-r-0 border-t-0 border-solid border-slate-300 bg-[#f6f8fa] px-2'>
        <div className='flex justify-between'>
          <AnswerUserInfo profile={profile} created_at={answer.created_at} />
          {session && <AnswerActions answer={answer} />}
        </div>
      </div>
      <AnswerContent answer={answer} isEditMode={isEditMode} />
    </>
  )
}
