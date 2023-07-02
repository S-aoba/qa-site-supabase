import Image from 'next/image'
import Link from 'next/link'

export const WithNotification = () => {
  return (
    <Link
      href={`/`}
      className='flex h-40 w-60 border-b border-l-0 border-r-0 border-t-0 border-solid border-gray-300 px-5 py-3 text-black no-underline hover:cursor-pointer hover:bg-slate-100'
    >
      <div className='flex items-center'>
        <Image src={'/lang-icon/next.js.svg'} width={60} height={60} className=' rounded-full' alt='userIcon' />
      </div>
      <div className='flex w-full flex-col items-center justify-center p-3'>
        <span className='line-clamp-2 font-semibold'>Test</span>
        <span className='text-sm'>について回答がありました。</span>
      </div>
    </Link>
  )
}
