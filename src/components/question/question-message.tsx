'use client'

import Link from 'next/link'

import { Button } from '../ui/button'

export const QuestionMessage = () => {
  return (
    <div className=' flex flex-col space-y-2 rounded-md border border-input bg-background py-10 text-center shadow text-muted-foreground '>
      <span>あなたも回答してみませんか？</span>
      <div>
        <Button type='button' variant='default' asChild>
          <Link href={'/auth/signup'}>新規登録</Link>
        </Button>
      </div>
      <p>
        すでにアカウントを持っている方は
        <Link href={'/auth/login'} className='text-foreground hover:underline hover:underline-offset-2'>
          ログイン
        </Link>
      </p>
    </div>
  )
}
