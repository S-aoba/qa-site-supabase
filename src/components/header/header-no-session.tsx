import Link from 'next/link'

import { Button } from '../ui/button'

export const HeaderNoSession = () => {
  return (
    <>
      <Button variant='outline' asChild>
        <Link href='/auth/login' className='no-underline'>
          ログイン
        </Link>
      </Button>
      <Button variant='default' asChild>
        <Link href='/auth/signup' className='no-underline'>
          新規登録
        </Link>
      </Button>
    </>
  )
}
