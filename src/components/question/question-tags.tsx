import Image from 'next/image'
import Link from 'next/link'

export const QuestionTags = ({ tags }: { tags: string[] }) => {
  return (
    <div className='flex space-x-3 py-2 text-sm'>
      {tags.map((tag, index) => {
        return (
          <Link
            key={index}
            href={'/'}
            className='flex items-center space-x-2 rounded-xl border border-solid border-slate-400 px-2 py-1 text-black no-underline'
          >
            <div className='relative h-4 w-4'>
              <Image
                src={`/lang-icon/${tag}.svg`}
                className='rounded-full object-cover'
                alt='avatar'
                fill
                sizes='auto'
                priority
              />
            </div>
            <span className='text-slate-600'>{tag}</span>
          </Link>
        )
      })}
    </div>
  )
}
