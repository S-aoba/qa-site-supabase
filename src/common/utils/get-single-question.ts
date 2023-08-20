import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { cache } from 'react'

import type { Database } from '@/lib/database.types'

export const revalidate = 3600

export const getSingleQuestion = cache(async (question_id: string) => {
  const supabase = createServerComponentClient<Database>({
    cookies,
  })
  const { data: singleQuestion } = await supabase
    .from('questions')
    .select('*, profiles(*)')
    .eq('id', question_id)
    .single()

  return { singleQuestion }
})
