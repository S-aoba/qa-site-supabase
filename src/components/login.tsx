import { LoginForm } from './login-form'

// ログインページ
export const Login = () => {
  return (
    <div className='mx-auto max-w-[400px] p-2'>
      <div className='mb-10 text-center text-xl font-bold'>Log In QA site</div>
      <LoginForm />
    </div>
  )
}
