import Link from 'next/link'

import { LoginForm } from './login-form'

export const Login = () => {
  return (
    <div className='space-y-10'>
      <div className='text-center'>
        <h1 className='text-2xl'>Login</h1>
      </div>
      <LoginForm />
      <div className='flex flex-col items-center justify-center space-y-3 rounded bg-white p-5 text-sm shadow-lg'>
        <Link href='/auth/reset-password' className='text-muted-foreground hover:text-black'>
          パスワードを忘れた方はこちら
        </Link>
        <Link href='/auth/signup' className='text-muted-foreground hover:text-black'>
          アカウントを作成する
        </Link>
      </div>
    </div>
  )
}
