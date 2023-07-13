'use client'

import { Button } from '@mantine/core'
import Link from 'next/link'

export const QuestionMessage = () => {
  return (
    <div className=' flex flex-col space-y-2 rounded-lg border border-solid border-slate-300 bg-[#f6f8fa] py-10 text-center'>
      <span>あなたも回答してみませんか？</span>
      <Link href={'/auth/signup'}>
        <Button
          type='button'
          className='rounded-lg bg-black font-bold text-white hover:transform-none hover:bg-black hover:opacity-75'
        >
          新規登録
        </Button>
      </Link>
      <p>
        すでにアカウントを持っている方は<Link href={'/auth/login'}>ログイン</Link>
      </p>
    </div>
  )
}
