'use client'
import type { Session } from '@supabase/auth-helpers-nextjs'
import { Provider as JotaiProvider } from 'jotai'
import type { ReactNode } from 'react'

import type { AnswerType } from '@/common/types'

import { Action } from '../ui/action'
import { AnswerContent } from './answer-content'

export const AnswerBody = ({
  answer,
  session,
  children,
}: {
  answer: AnswerType
  session: Session | null
  children: ReactNode
}) => {
  return (
    <JotaiProvider>
      <div className='rounded-t-lg border-b border-l-0 border-r-0 border-t-0 border-solid border-slate-300 bg-[#f6f8fa] px-2'>
        <div className='flex justify-between'>
          {children}
          {session && session.user.id === answer.user_id && <Action type='default' answer={answer} />}
        </div>
      </div>
      <AnswerContent answer={answer} />
    </JotaiProvider>
  )
}
