import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

import NotFound from '@/app/not-found'
import type { Database } from '@/lib/database.types'

import { Card } from '../ui/card'

export const NewQuestionList = async () => {
  const supabase = createServerComponentClient<Database>({ cookies })
  const { data: questions, error } = await supabase
    .from('questions')
    .select('*')
    .order('updated_at', { ascending: false })
    .limit(10)

  if (error) return <NotFound />

  return (
    <main className='flex flex-col items-center justify-center space-y-4'>
      {questions.length === 0 ? (
        <div>質問はありません</div>
      ) : (
        questions.map((question) => {
          return <Card key={question.id} question={question} />
        })
      )}
    </main>
  )
}
