import Image from 'next/image'

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='container mx-auto max-w-[600px] space-y-5'>
      <div className='flex flex-col space-y-10'>
        <div className='flex justify-center py-2'>
          <div className='inline-block rounded-full bg-white p-3 shadow-lg'>
            <Image src={'/logo.png'} width={80} height={80} alt='Logo' priority />
          </div>
        </div>
        <div className='space-y-2 text-center'>
          <p className='text-3xl'>Welcome to QA site with supabase</p>
          <p className='text-slate-400'>Time spent worrying is sometimes wasted.</p>
        </div>
      </div>
      {children}
    </div>
  )
}
export default AuthLayout
