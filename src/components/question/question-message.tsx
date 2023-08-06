'use client'

import Link from 'next/link'

import { Button } from '../ui/button'

export const QuestionMessage = () => {
  return (
    <div className=' flex flex-col space-y-2 rounded-lg border py-10 text-center'>
      <span>あなたも回答してみませんか？</span>
      <div>
        <Button type='button' variant='default' asChild>
          <Link href={'/auth/signup'}>新規登録</Link>
        </Button>
      </div>
      <p>
        すでにアカウントを持っている方は<Link href={'/auth/login'}>ログイン</Link>
      </p>
    </div>
  )
}
