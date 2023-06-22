import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import Image from 'next/image'
import Link from 'next/link'

import type { QuestionType } from '@/common/types'

export const Card = async ({ question }: { question: QuestionType }) => {
  const supabase = createServerComponentClient({ cookies })
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', question.user_id).single()
  return (
    <div className='flex h-fit w-full items-center gap-x-3 rounded-lg bg-white px-2 py-4'>
      <div className='flex h-9 w-9 items-center justify-center rounded-full border bg-white text-amber-500 shadow-lg hover:cursor-pointer hover:bg-gray-200'>
        {question.tags[0]}
      </div>
      <div className='flex w-full flex-col justify-center'>
        <div className='flex items-center gap-x-2 text-xs'>
          <span className='line-clamp-1 w-fit max-w-[500px] rounded-lg bg-cyan-300 px-2 py-1 leading-5 text-stone-500'>
            {question.coding_problem}
          </span>
          <div className='flex flex-col gap-y-1 text-gray-500'>
            <span>投稿日: {question.created_at.slice(0, 10)}</span>
            <div className=' flex items-center gap-x-2'>
              <div className='relative h-10 w-10'>
                <Image
                  src={profile && profile.avatar_url ? profile.avatar_url : '/default.png'}
                  className='rounded-full object-cover'
                  alt='avatar'
                  fill
                  sizes='auto'
                  priority
                />
              </div>
              <span className='line-clamp-1 w-fit max-w-[150px]'>{profile && profile.username}</span>
            </div>
          </div>
        </div>
        <Link href={'/'} className='line-clamp-1 hover:underline hover:underline-offset-4'>
          {question.title}
        </Link>
      </div>
    </div>
  )
}
