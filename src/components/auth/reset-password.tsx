import { ResetPasswordForm } from './reset-password-form'

// パスワードリセットページ
export const ResetPassword = () => {
  return (
    <div className='mx-auto flex max-w-[400px] flex-col space-y-10'>
      <div className='text-center'>パスワードを忘れた場合</div>
      <ResetPasswordForm />
    </div>
  )
}
