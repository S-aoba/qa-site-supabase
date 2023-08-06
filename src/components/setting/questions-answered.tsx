import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

import type { Database } from '@/lib/database.types'

import { Card } from '../ui/card'

export const QuestionsAnswered = async ({ userId }: { userId: string }) => {
  const supabase = createServerComponentClient<Database>({ cookies })
  // 回答した質問を取得する
  const { data: questionsAnswered } = await supabase.from('answers').select('questions(*)').eq('user_id', userId)

  if (questionsAnswered === null || questionsAnswered.length === 0) {
    return (
      <main className='flex flex-col justify-center'>
        <div className='p-2 text-center'>まだ回答した質問はありません</div>
      </main>
    )
  }

  return (
    <main className='flex flex-col justify-center space-y-4'>
      {questionsAnswered.map((answer) => {
        return (
          <>
            {answer.questions === null ? (
              <div className='p-2 text-2xl font-semibold'>質問がありません</div>
            ) : (
              <Card key={answer.questions.id} question={answer.questions} />
            )}
          </>
        )
      })}
    </main>
  )
}
