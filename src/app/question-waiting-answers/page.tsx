import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

import { Card } from '@/components/ui/card'
import type { Database } from '@/lib/database.types'

export const metadata = {
  title: '回答募集中 - QA-site-supabase',
  description: '回答募集中 - QA-site-supabase',
}

const QuestionWaitingAnswersPage = async () => {
  const supabase = createServerComponentClient<Database>({ cookies })

  const { data: questionWaitingAnswers } = await supabase
    .from('question_waiting_answers')
    .select('questions(*)')
    .limit(10)

  return (
    <div className='flex flex-wrap justify-start'>
      {questionWaitingAnswers?.length === 0 ? (
        <div>質問はありません</div>
      ) : (
        questionWaitingAnswers?.map((questionWaitingAnswer) => {
          return (
            questionWaitingAnswer.questions && (
              <Card key={questionWaitingAnswer.questions?.id} question={questionWaitingAnswer.questions} />
            )
          )
        })
      )}
    </div>
  )
}
export default QuestionWaitingAnswersPage
