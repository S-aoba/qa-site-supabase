import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { cache } from 'react'

import type { Database } from '@/lib/database.types'

export const revalidate = 3600
export const getQuestionWaitingAnswers = cache(async () => {
  const supabase = createServerComponentClient<Database>({ cookies })

  const { data: questionWaitingAnswers } = await supabase
    .from('question_waiting_answers')
    .select('questions(*)')
    .limit(10)

  return { questionWaitingAnswers }
})
