import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

import type { Database } from '@/lib/database.types'

import { Card } from '../ui/card'

export const QuestionSearch = async ({ q }: { q: string | string[] | undefined }) => {
  const supabase = createServerComponentClient<Database>({ cookies })
  const { data: questions } = await supabase
    .from('questions')
    .select('*')
    .ilike('title', `%${q}%`)
    .order('updated_at', { ascending: false })
    .limit(10)
  
  return (
    <main className='flex flex-wrap justify-start'>
      {questions && questions.length === 0 ? (
        <div className='flex flex-col text-2xl'>
          <span>検索ワード: {q}</span>
          <span>該当する質問は見つかりませんでした。</span>
        </div>
      ) : (
        questions?.map((question) => {
          return <Card key={question.id} question={question} />
        })
      )}
    </main>
  )
}
