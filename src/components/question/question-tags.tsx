import Image from 'next/image'
import Link from 'next/link'

import { capitalizeFirstLetter } from '@/common/function/convert'

export const QuestionTags = ({ tags }: { tags: string[] }) => {
  return (
    <div className='flex space-x-3 overflow-x-hidden border-b border-input p-2 text-sm dark:brightness-75'>
      {tags.map((tag, index) => {
        const modifiedTag = capitalizeFirstLetter(tag)
        return (
          <Link
            key={index}
            href={'/'}
            className='flex items-center space-x-2 rounded-xl border border-border px-2 py-1'
          >
            <div className='relative h-4 w-4'>
              <Image
                src={`/lang-icon/${modifiedTag}.svg`}
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
