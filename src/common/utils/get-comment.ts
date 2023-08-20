import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { cache } from 'react'

import type { Database } from '@/lib/database.types'

export const revalidate = 3600

export const getComments = cache(async (answer_id: string) => {
  const supabase = createServerComponentClient<Database>({
    cookies,
  })
  const { data: comments } = await supabase.from('comments').select('*').eq('answer_id', answer_id).order('created_at')

  return { comments }
})
