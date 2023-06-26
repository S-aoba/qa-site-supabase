'use client'

import { Button } from '@mantine/core'
import { RichTextEditor } from '@mantine/tiptap'
// import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Image from 'next/image'
import { useState } from 'react'

import Loading from '@/app/loading'

import { useDescriptionEditor } from './hooks/useDescriptionEditor'
// import { usePathname } from 'next/navigation'

// import type { Database } from '@/lib/database.types'

export const Answer = () => {
  const [isLoading, _] = useState(false)

  const { answerEditor } = useDescriptionEditor()
  // const supabase = createClientComponentClient<Database>()

  // const pathname = usePathname()
  // const question_id = pathname.split('/')[3]

  // const { data: answers } = await supabase.from('answers').select('*').eq('question_id', question_id).single()

  return (
    <div className='p-2'>
      <div className='p-2 text-2xl font-semibold'>Answer</div>
      <div className='py-4'>
        <div className='rounded-lg border border-solid border-slate-300 pb-5'>
          <div className='rounded-t-lg border-b border-l-0 border-r-0 border-t-0 border-solid border-slate-300 bg-[#f6f8fa] px-2'>
            <div className='flex items-center space-x-2'>
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
              <div>
                <p className='text-sm'>username</p>
              </div>
              <div>
                <span className='text-sm'>投稿日: 2023-01-01</span>
              </div>
              <span className='line-clamp-1 w-fit max-w-[500px] rounded-lg bg-cyan-300 px-2 py-1 text-sm leading-5 text-stone-500'>
                test
              </span>
            </div>
          </div>
          <div className='break-words p-3'>hello</div>
        </div>
      </div>
      {/* answer form */}
      <form className='py-2'>
        <RichTextEditor
          editor={answerEditor}
          className=' min-h-[400px] w-full rounded-md border border-solid border-slate-300 shadow'
        >
          <RichTextEditor.Content />
        </RichTextEditor>
        <div className='flex w-full justify-end p-3'>
          {isLoading ? (
            <Loading />
          ) : (
            <Button type='submit' className='bg-slate-500 hover:transform-none hover:bg-slate-600'>
              回答を投稿
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}
