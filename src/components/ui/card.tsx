import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { IconMessageCircle } from '@tabler/icons-react'
import { cookies } from 'next/headers'
import Image from 'next/image'
import Link from 'next/link'

import type { QuestionType } from '@/common/types'
import type { Database } from '@/lib/database.types'

export const Card = async ({ question }: { question: QuestionType }) => {
  const supabase = createServerComponentClient<Database>({ cookies })
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', question.user_id).single()
  const { data: answers } = await supabase.from('answers').select('*').eq('question_id', question.id) //もっと他にいい方法を考える

  const targetDate = new Date(question.created_at.slice(0, 10))

  // 今日の日付を取得
  const today = new Date()

  // 日付の差を計算
  const timeDifference = targetDate.getTime() - today.getTime()

  // 日数に変換（絶対値を使用）
  const daysDifference = Math.abs(Math.ceil(timeDifference / (1000 * 60 * 60 * 24)))

  return (
    <div className='m-3 flex h-36 w-96 items-center rounded bg-background px-2 text-card-foreground shadow dark:border dark:border-border dark:shadow-border'>
      <div className='relative h-8 w-8'>
        <Image
          className='rounded-full object-cover dark:brightness-75'
          src={`/lang-icon/${question.tags[0]}.svg`}
          alt='language-icon'
          width={40}
          height={40}
          priority
        />
      </div>

      <div className='flex w-full flex-col space-y-2 px-2 text-sm'>
      <div className='w-fit max-w-[300px] truncate rounded bg-[#B4D0C4] px-2 py-1'>
            <span className='text-popover'>{question.coding_problem}</span>
          </div>
        <div className='flex items-center space-x-2  truncate'>
          <div className='relative h-8 w-8'>
            <Image
              className='rounded-full object-cover dark:brightness-75'
              src={profile && profile.avatar_url ? profile.avatar_url : '/default.png'}
              alt='avatar'
              width={30}
              height={30}
              priority
            />
          </div>
          <Link href={'/'} className='w-fit max-w-[100px] truncate hover:underline hover:underline-offset-4'>
            {profile && profile.username}
          </Link>
          <span>{daysDifference === 0 ? '今日' : `${daysDifference}日前`}</span>
          <div className='flex space-x-1'>
            <IconMessageCircle size={18} />
            <span>{answers?.length}</span>
          </div>
        </div>
        <Link
          href={`/${profile?.username}/questions/${question.id}`}
          className='line-clamp-2 hover:underline hover:underline-offset-4'
        >
          {question.title}
        </Link>
      </div>
    </div>
  )
}
