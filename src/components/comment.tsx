'use client'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

import type { Database } from '@/lib/database.types'

export const Comment = async ({ commentId }: { commentId: string }) => {
  const supabase = createClientComponentClient<Database>()

  const { data: comment } = await supabase.from('comments').select('*').eq('id', commentId).single()

  return (
    <div className='mx-2 px-2 border-b border-l-0 border-r-0 border-t-0 border-solid border-slate-300'>
      {comment && <div className='break-words py-2' dangerouslySetInnerHTML={{ __html: comment.content }} />}
    </div>
  )
}
