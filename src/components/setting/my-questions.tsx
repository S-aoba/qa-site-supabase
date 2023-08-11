import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

import type { Database } from '@/lib/database.types'

import { Card } from '../ui/card'

export const MyQuestions = async ({ userId }: { userId: string }) => {
  const supabase = createServerComponentClient<Database>({ cookies })
  const { data: myQuestions } = await supabase.from('questions').select('*').eq('user_id', userId)
  return (
    <main className='flex flex-wrap justify-start'>
      {myQuestions?.map((question) => {
        return <Card key={question.id} question={question} />
      })}
    </main>
  )
}
