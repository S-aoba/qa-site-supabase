import Image from 'next/image'
import Link from 'next/link'

export const QuestionTags = ({ tags }: { tags: string[] }) => {
  return (
    <div className='flex space-x-3 overflow-x-scroll py-2 text-sm '>
      {tags.map((tag, index) => {
        return (
          <Link
            key={index}
            href={'/'}
            className='flex items-center space-x-2 rounded-xl border px-2 py-1'
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
            <span className=''>{tag}</span>
          </Link>
        )
      })}
    </div>
  )
}
