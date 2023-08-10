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

  // 2023/07/15の日付を作成
  const targetDate = new Date(question.created_at.slice(0, 10))

  // 今日の日付を取得
  const today = new Date()

  // 日付の差を計算
  const timeDifference = targetDate.getTime() - today.getTime()

  // 日数に変換（絶対値を使用）
  const daysDifference = Math.abs(Math.ceil(timeDifference / (1000 * 60 * 60 * 24)))

  return (
    <div className='grid grid-cols-12 rounded-lg shadow w-96 bg-background m-3 p-3 text-muted-foreground'>
      <div className='col-span-2 flex items-center justify-center rounded-bl-lg rounded-tl-lg md:col-span-1'>
        <Image src={`/lang-icon/${question.tags[0]}.svg`} alt='language-icon' width={40} height={40} priority />
      </div>
      <div className='col-span-10 flex w-full flex-col space-y-2 py-3 pl-2 md:col-span-11'>
        <div className='w-fit max-w-[300px] truncate rounded-lg px-2'>{question.coding_problem}</div>
        <div className='flex items-center space-x-2 text-sm'>
          <Image
            src={profile && profile.avatar_url ? profile.avatar_url : '/default.png'}
            alt='avatar'
            width={30}
            height={30}
            priority
          />
          <Link href={'/'} className='w-fit max-w-[100px] truncate'>
            {profile && profile.username}
          </Link>
          <span>{daysDifference === 0 ? '今日' : `${daysDifference}日前`}</span>
          <IconMessageCircle size={18} />
          {answers?.length}
        </div>
        <div className='w-full truncate'>
          <Link
            href={`/${profile?.username}/questions/${question.id}`}
            className='hover:text-foreground'
          >
            {question.title}
          </Link>
        </div>
      </div>
    </div>
  )
}
