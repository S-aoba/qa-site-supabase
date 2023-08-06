import Link from 'next/link'

import { Button } from '../ui/button'

export const HeaderNoSession = () => {
  return (
    <>
      <Button variant='outline' asChild>
        <Link href='/auth/login'>ログイン</Link>
      </Button>
      <Button variant='default' asChild>
        <Link href='/auth/signup'>新規登録</Link>
      </Button>
    </>
  )
}
