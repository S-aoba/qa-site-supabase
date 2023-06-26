import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import Image from 'next/image'
import Link from 'next/link'

import type { QuestionType } from '@/common/types'
import type { Database } from '@/lib/database.types'

export const Card = async ({ question }: { question: QuestionType }) => {
  const supabase = createServerComponentClient<Database>({ cookies })
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', question.user_id).single()
  return (
    <div className='flex h-fit w-full items-center gap-x-3 rounded-lg border border-solid border-slate-300 bg-white px-2 py-4'>
      <Image
        src={`/lang-icon/${question.tags[0]}.svg`}
        className='rounded-full'
        alt='language-icon'
        width={40}
        height={40}
        sizes='auto'
        priority
      />
      <div className='flex w-full flex-col justify-center'>
        <div className='flex items-center gap-x-2 text-xs'>
          <span className='line-clamp-1 w-fit max-w-[500px] rounded-lg bg-slate-500 px-2 py-1 leading-5 text-stone-50'>
            {question.coding_problem}
          </span>
          <div className='flex flex-col gap-y-1 text-gray-500'>
            <span>投稿日: {question.created_at.slice(0, 10)}</span>
            <div className=' flex items-center gap-x-2'>
              <div className='relative h-6 w-6'>
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
        <Link
          href={`/${profile?.username}/questions/${question.id}`}
          className='line-clamp-1 font-semibold text-black no-underline hover:underline hover:underline-offset-4'
        >
          {question.title}
        </Link>
      </div>
    </div>
  )
}
