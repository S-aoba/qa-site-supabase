import { LoginForm } from './login-form'

// ログインページ
export const Login = () => {
  return (
    <div className='mx-auto flex max-w-[400px] flex-col space-y-10'>
      <div className='text-center text-2xl font-bold'>QA siteにログインする</div>
      <LoginForm />
    </div>
  )
}