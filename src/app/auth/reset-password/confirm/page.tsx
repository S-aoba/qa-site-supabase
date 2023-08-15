import { ResetPasswordCombineForm } from '@/components/auth/reset-password-combine-form'

export const metadata = {
  title: 'パスワードリセット確認 - QA-site-supabase',
  description: 'パスワードリセット確認 - QA-site-supabase',
}

// パスワード再設定ページ
const ResetPasswordConfirmPage = () => {
  return (
    <div>
      <ResetPasswordCombineForm />
    </div>
  )
}

export default ResetPasswordConfirmPage
