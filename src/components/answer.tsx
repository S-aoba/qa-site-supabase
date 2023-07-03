'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { usePathname } from 'next/navigation'

import type { QuestionType } from '@/common/types'
import type { Database } from '@/lib/database.types'

import { AnswerBody } from './answer-body'
import { AnswerCreateForm } from './answer-create-form'

export const Answer = async ({ userId, question }: { userId: string | undefined; question: QuestionType }) => {
  const supabase = createClientComponentClient<Database>()

  const pathname = usePathname()
  const question_id = pathname.split('/')[3]

  const { data: answers } = await supabase.from('answers').select('*').eq('question_id', question_id)

  return (
    <div className='p-2'>
      <div className='p-2 text-2xl font-semibold'>Answer</div>
      <div className='space-y-4 py-4'>
        {answers?.map((answer) => {
          return <AnswerBody key={answer.id} answer={answer} userId={userId} />
        })}
        {userId && <AnswerCreateForm userId={userId} question={question} />}
      </div>
    </div>
  )
}
