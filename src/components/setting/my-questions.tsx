import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

import NotFound from '@/app/not-found'
import type { Database } from '@/lib/database.types'

import { Card } from '../ui/card'

export const MyQuestions = async ({ userId }: { userId: string }) => {
  const supabase = createServerComponentClient<Database>({ cookies })
  const { data: myQuestions } = await supabase.from('questions').select('*').eq('user_id', userId)
  if (myQuestions === null) return <NotFound />

  return (
    <>
      {myQuestions.length === 0 ? (
        <div className='flex flex-col justify-center'>
          <div className='p-2 text-center'>まだ質問はありません</div>
        </div>
      ) : (
        <div className='flex flex-wrap justify-start'>
          {myQuestions.map((question) => {
            return <Card key={question.id} question={question} />
          })}
        </div>
      )}
    </>
  )
}
