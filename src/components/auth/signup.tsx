import Image from 'next/image'
import Link from 'next/link'

import { SignupForm } from './signup-form'

export const Signup = () => {
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
