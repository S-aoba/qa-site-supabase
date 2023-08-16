import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

import NotFound from '@/app/not-found'
import { Card } from '@/components/ui/card'
import type { Database } from '@/lib/database.types'

export const QuestionWaitingAnswers = async () => {
  const supabase = createServerComponentClient<Database>({ cookies })

  const { data: questionWaitingAnswers, error } = await supabase
    .from('question_waiting_answers')
    .select('questions(*)')
    .limit(10)

  if (error) return <NotFound />

  return (
    <>
      {questionWaitingAnswers.length === 0 ? (
        <div className='flex flex-col justify-center'>
          <div className='p-2 text-center'>まだ質問はありません</div>
        </div>
      ) : (
        <div className='flex flex-wrap justify-start'>
          {questionWaitingAnswers.map((questionWaitingAnswer) => {
            return (
              questionWaitingAnswer.questions && (
                <Card key={questionWaitingAnswer.questions?.id} question={questionWaitingAnswer.questions} />
              )
            )
          })}
        </div>
      )}
    </>
  )
}
