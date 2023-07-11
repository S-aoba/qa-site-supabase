'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useState } from 'react'

import type { AnswerType } from '@/common/types'
import type { Database } from '@/lib/database.types'

import { Comment } from '../comment/comment'
import { Content } from './answer-content'
import { AnswerSettings } from './answer-settings'

export const AnswerBody = async ({ answer, userId }: { answer: AnswerType; userId: string | undefined }) => {
  const [isEditMode, setIsEditMode] = useState(false)

  const supabase = createClientComponentClient<Database>()
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', answer?.user_id).single()

  return (
    <div className='rounded-lg border border-solid border-slate-300'>
      <AnswerSettings
        answer={answer}
        userId={userId}
        profile={profile}
        isEditMode={isEditMode}
        setIsEditMode={setIsEditMode}
      />
      <Content answer={answer} isEditMode={isEditMode} userId={userId} />
      <Comment answer={answer} userId={userId} />
    </div>
  )
}
