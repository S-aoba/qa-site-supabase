import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

import { Card } from '@/components/card'
import type { Database } from '@/lib/database.types'

export default async function Home() {
  const supabase = createServerComponentClient<Database>({ cookies })
  const { data: questions } = await supabase.from('questions').select('*').order('updated_at', { ascending: false })

  return (
    <main className='flex flex-col justify-center space-y-4'>
      {questions?.map((question) => {
        return <Card key={question.id} question={question} />
      })}
    </main>
  )
}
