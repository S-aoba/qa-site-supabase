import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

import { Card } from '@/components/card'
import type { Database } from '@/lib/database.types'

export const MyQuestions = async ({ userId }: { userId: string }) => {
  const supabase = createServerComponentClient<Database>({ cookies })
  const { data: myQuestions } = await supabase.from('questions').select('*').eq('user_id', userId)
  return (
    <main className='flex flex-col justify-center space-y-4'>
      {myQuestions?.map((question) => {
        return <Card key={question.id} question={question} />
      })}
    </main>
  )
}
