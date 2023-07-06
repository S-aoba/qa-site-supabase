import { SignupForm } from './signup-form'

export const Signup = () => {
  return (
    <div className='mx-auto flex max-w-[400px] flex-col space-y-10'>
      <div className='text-center text-2xl font-bold'>新規登録 QA site</div>
      <SignupForm />
    </div>
  )
}
