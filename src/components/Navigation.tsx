import Link from 'next/link'

export const Navigation = () => {
  return (
    <div className='flex w-full justify-center py-2 font-extrabold text-white'>
      <div className='flex w-full max-w-[800px] gap-x-10 px-2'>
        <Link href={'/'} className=' hover:text-gray-300'>
          新着
        </Link>
        <Link href={'/'} className=' hover:text-gray-300'>
          回答募集中
        </Link>
        <Link href={'/'} className=' hover:text-gray-300'>
          マイページ
        </Link>
      </div>
    </div>
  )
}
