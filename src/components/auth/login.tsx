import Image from 'next/image'
import Link from 'next/link'

import { LoginForm } from './login-form'

export const Login = () => {
  return (
    <div className='container mx-auto flex max-w-[600px] flex-col space-y-10'>
      <div className='flex justify-center py-2'>
        <div className='inline-block rounded-full bg-white p-3 shadow-lg'>
          <Image src={'/logo.png'} width={80} height={80} alt='Logo' priority />
        </div>
      </div>
      <div className='space-y-2 text-center'>
        <p className='text-3xl'>Welcome to QA site with supabase</p>
        <p className='text-slate-400'>Time spent worrying is sometimes wasted.</p>
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
