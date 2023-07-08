import { Button } from '@mantine/core'
import Link from 'next/link'

export const HeaderNoSession = () => {
  return (
    <div className='flex items-center space-x-5 px-10'>
      <Link href='/auth/login' className='no-underline'>
        <Button
          type='submit'
          className='rounded-lg border border-solid border-slate-300 bg-white text-black hover:transform-none hover:border-black hover:bg-white'
        >
          ログイン
        </Button>
      </Link>
      <Link href='/auth/signup' className='no-underline'>
        <Button type='submit' className='rounded-lg bg-black hover:transform-none hover:bg-black hover:opacity-75'>
          新規登録
        </Button>
      </Link>
    </div>
  )
}
