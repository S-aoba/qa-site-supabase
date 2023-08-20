import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { cache } from 'react'

import type { Database } from '@/lib/database.types'

export const revalidate = 3600

export const getNotification = cache(async (user_id: string) => {
  const supabase = createServerComponentClient<Database>({ cookies })
  const { data: notifications } = await supabase.from('notifications').select('*').eq('user_id', user_id)
  return { notifications }
})
