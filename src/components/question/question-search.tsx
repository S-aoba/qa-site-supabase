import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

import { Card } from '@/components/card/card'
import type { Database } from '@/lib/database.types'

export const QuestionSearch = async ({ q }: { q: string | string[] | undefined }) => {
  const supabase = createServerComponentClient<Database>({ cookies })
  const { data: questions } = await supabase
    .from('questions')
    .select('*')
    .like('title', `%${q}%`)
    .order('updated_at', { ascending: false })
    .limit(10)
  return (
    <main className='flex flex-col items-center justify-center space-y-4'>
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
