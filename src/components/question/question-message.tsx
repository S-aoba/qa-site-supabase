'use client'

import Link from 'next/link'

import { Button } from '../ui/button'

export const QuestionMessage = () => {
  return (
    <div className=' flex flex-col space-y-2 rounded-lg border border-solid border-slate-300 bg-[#f6f8fa] py-10 text-center'>
      <span>あなたも回答してみませんか？</span>
      <Button type='button' variant='default' asChild>
        <Link href={'/auth/signup'} className='text-black no-underline'>
          新規登録
        </Link>
      </Button>
      <p>
        すでにアカウントを持っている方は<Link href={'/auth/login'}>ログイン</Link>
      </p>
    </div>
  )
}
