import Link from 'next/link'

import { SignupForm } from './signup-form'

export const Signup = () => {
  return (
    <div className='space-y-10'>
      <div className='text-center'>
        <h1 className='text-2xl'>Signup</h1>
      </div>
      <SignupForm />
      <div className='flex items-center justify-center space-x-3 rounded bg-white p-5 text-sm shadow-lg'>
        <span className='text-muted-foreground'>既にアカウントはお持ちですか?</span>
        <Link href='/auth/login' className='text-muted-foreground hover:text-black'>
          ログインはこちら
        </Link>
      </div>
    </div>
  )
}
