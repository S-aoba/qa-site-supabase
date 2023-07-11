'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { usePathname } from 'next/navigation'

import type { QuestionType } from '@/common/types'
import type { Database } from '@/lib/database.types'

import { AnswerCreateForm } from './answer-create-form'
import { NoAnswerMessage } from './no-answer-message'
import { WithAnswer } from './with-answer'

export const Answer = async ({ userId, question }: { userId: string | undefined; question: QuestionType }) => {
  const supabase = createClientComponentClient<Database>()

  const pathname = usePathname()
  const question_id = pathname.split('/')[3]

  const { data: answers } = await supabase.from('answers').select('*').eq('question_id', question_id)

  return (
    <div className='p-2'>
      {answers !== null && answers.length > 0 ? <WithAnswer answers={answers} userId={userId} /> : <NoAnswerMessage />}
      {userId && <AnswerCreateForm userId={userId} question={question} />}
    </div>
  )
}
