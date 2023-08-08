import Link from 'next/link'

import { ResetPasswordForm } from './reset-password-form'

export const ResetPassword = () => {
  return (
    <div className='space-y-10'>
      <div className='text-center'>
        <h1 className='text-2xl'>Reset Password</h1>
      </div>
      <ResetPasswordForm />
      <div className='flex flex-col items-center justify-center space-y-3 rounded bg-white p-5 text-sm shadow-lg'>
        <Link href='/auth/login' className='text-muted-foreground hover:text-black'>
          ログインはこちら
        </Link>
      </div>
    </div>
  )
}
