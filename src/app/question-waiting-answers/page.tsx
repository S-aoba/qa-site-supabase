import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

import { Card } from '@/components/ui/card'
import type { Database } from '@/lib/database.types'

const QuestionWaitingAnswersPage = async () => {
  const supabase = createServerComponentClient<Database>({ cookies })

  const { data: questionWaitingAnswers } = await supabase
    .from('question_waiting_answers')
    .select('questions(*)')
    .limit(10)

  return (
    <main className='flex flex-wrap justify-start space-y-3'>
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
    </main>
  )
}
export default QuestionWaitingAnswersPage
