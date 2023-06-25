import Image from 'next/image'
import Link from 'next/link'

export const Question = () => {
  return (
    <div className='p-2'>
      {/* Title */}
      <div className='bg-blue-50 text-center'>
        <h1>Title</h1>
      </div>
      <div className='rounded-lg border border-solid border-slate-300 pb-5'>
        <div className='rounded-t-lg border-b border-l-0 border-r-0 border-t-0 border-solid border-slate-300 bg-[#f6f8fa] px-2'>
          {/* user and question info */}
          <div className='flex items-center space-x-2'>
            {/* userIcon */}
            <div className='relative h-6 w-6'>
              <Image
                src={'/default.png'}
                className='rounded-full object-cover'
                alt='avatar'
                fill
                sizes='auto'
                priority
              />
            </div>
            {/* username */}
            <div>
              <p className='text-sm'>Username</p>
            </div>
            {/* question posted day */}
            <div>
              <span className='text-sm'>投稿日: 2023 / 06 / 25</span>
            </div>
            <span className='line-clamp-1 w-fit max-w-[500px] rounded-lg bg-cyan-300 px-2 py-1 text-sm leading-5 text-stone-500'>
              問題225: 文字列の長さ（再帰）
            </span>
          </div>
          {/* tags */}
          <div className='flex space-x-3 py-2 text-sm'>
            <Link
              href={'/'}
              className='flex items-center space-x-2 rounded-xl border border-solid border-slate-400 px-2 py-1 text-black no-underline'
            >
              <div className='relative h-4 w-4'>
                <Image
                  src={'/lang-icon/typescript.svg'}
                  className='rounded-full object-cover'
                  alt='avatar'
                  fill
                  sizes='auto'
                  priority
                />
              </div>
              <span className='text-slate-600'>typescript</span>
            </Link>
          </div>
        </div>
        {/* description */}
        <div className='break-words p-3'>
          DescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescription
        </div>
      </div>
    </div>
  )
}
