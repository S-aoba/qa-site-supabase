import { ResetPasswordCombineForm } from '@/components/auth/reset-password-combine-form'

// パスワード再設定ページ
const ResetPasswordConfirmPage = () => {
  return (
    <div className='mx-auto max-w-[400px]'>
      {/* パスワード変更 */}
      <ResetPasswordCombineForm />
    </div>
  )
}

export default ResetPasswordConfirmPage
