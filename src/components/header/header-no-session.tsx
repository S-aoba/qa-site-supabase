import Link from 'next/link'

import { Button } from '../ui/button'

export const HeaderNoSession = () => {
  return (
    <>
      <Button variant='outline' asChild>
        <Link href='/auth/login' className='text-black no-underline'>
          ログイン
        </Link>
      </Button>
      <Button variant='default' asChild>
        <Link href='/auth/signup' className='text-white no-underline'>
          新規登録
        </Link>
      </Button>
    </>
  )
}
