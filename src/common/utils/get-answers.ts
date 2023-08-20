import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { cache } from 'react'

import type { Database } from '@/lib/database.types'

export const revalidate = 3600

export const getAnswers = cache(async (question_id: string) => {
  const supabase = createServerComponentClient<Database>({
    cookies,
  })

  const { data: answers } = await supabase.from('answers').select('*').eq('question_id', question_id)

  return { answers }
})
