import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

import { Card } from '@/components/card'
import type { Database } from '@/lib/database.types'

export default async function Home() {
  const supabase = createServerComponentClient<Database>({ cookies })
  const { data: questions } = await supabase.from('questions').select('*')

  return (
    <main className='flex flex-1 justify-center bg-stone-200'>
      <div className='flex w-full max-w-[800px] flex-col gap-y-3 px-2 py-3'>
        {questions?.map((question) => {
          return <Card key={question.id}/>
        })}
      </div>
    </main>
  )
}
