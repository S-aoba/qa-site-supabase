import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

import { Card } from '@/components/card'
import type { Database } from '@/lib/database.types'

const QuestionWaitingAnswers = async () => {
  const supabase = createServerComponentClient<Database>({ cookies })
  const { data: questions } = await supabase
    .from('questions')
    .select('*')
    .is('answered_list', null)
    .order('updated_at', { ascending: false }).limit(10)

  return (
    <main className='flex flex-col justify-center space-y-4'>
      {questions?.map((question) => {
        return <Card key={question.id} question={question} />
      })}
    </main>
  )
}
export default QuestionWaitingAnswers
