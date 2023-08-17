import Image from 'next/image'


export const QuestionTags = ({ tags }: { tags: string[] }) => {
  return (
    <div className='flex space-x-3 overflow-x-hidden border-b border-input p-2 text-sm dark:brightness-75'>
      {tags.map((tag, index) => {
        return (
          <div key={index} className='flex items-center space-x-2 rounded-xl border border-border px-2 py-1'>
            <div className='relative h-4 w-4'>
              <Image
                src={`/${tag}.svg`}
                className='rounded-full object-cover'
                alt='avatar'
                fill
                sizes='auto'
                priority
              />
            </div>
            <span className=''>{tag}</span>
          </div>
        )
      })}
    </div>
  )
}
