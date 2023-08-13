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
      <div className='rounded-t-lg border-b px-2 text-primary dark:brightness-75'>
        <div className='flex justify-between'>
          {children}
          {session && session.user.id === answer.user_id && <Action type='default' answer={answer} />}
        </div>
      </div>
      <AnswerContent answer={answer} />
    </JotaiProvider>
  )
}
