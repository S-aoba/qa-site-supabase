import Link from 'next/link'

import { Button } from '../ui/button'

export const HeaderNoSession = () => {
  return (
    <>
      <Link href='/auth/login' className='no-underline'>
        <Button type='submit' variant='login'>
          ログイン
        </Button>
      </Link>
      <Link href='/auth/signup' className='no-underline'>
        <Button type='submit' variant='signup'>
          新規登録
        </Button>
      </Link>
    </>
  )
}
