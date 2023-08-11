'use client'

import Link from 'next/link'

import { Button } from '../ui/button'

export const QuestionMessage = () => {
  return (
    <div className='flex flex-col space-y-2 rounded-md border border-input bg-background py-5 text-center text-sm text-muted-foreground shadow'>
      <span>あなたも回答してみませんか？</span>
      <div>
        <Button type='button' variant='default' asChild>
          <Link href={'/auth/signup'}>新規登録</Link>
        </Button>
      </div>
      <div className='flex justify-center space-x-2 py-2'>
        <span className='text-muted-foreground'>既にアカウントはお持ちですか?</span>
        <Link href='/auth/login' className='text-muted-foreground hover:text-black'>
          ログインはこちら
        </Link>
      </div>
    </div>
  )
}
