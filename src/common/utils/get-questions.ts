import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { cache } from 'react'

import type { Database } from '@/lib/database.types'

export const revalidate = 3600

export const getQuestions = cache(async () => {
  const supabase = createServerComponentClient<Database>({ cookies })
  const { data: questions } = await supabase
    .from('questions')
    .select('*')
    .order('updated_at', { ascending: false })
    .limit(10)
  return { questions }
})
