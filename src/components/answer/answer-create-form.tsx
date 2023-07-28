'use client'

import { RichTextEditor } from '@mantine/tiptap'
import { ReloadIcon } from '@radix-ui/react-icons'
import Image from 'next/image'

import type { ProfileType, QuestionType } from '@/common/types'

import { Button } from '../ui/button'
import { useCreateAnswer } from './useCreateAnswer'

export const AnswerCreateForm = ({
  userId,
  question,
  profile,
}: {
  userId: string
  question: QuestionType
  profile: ProfileType | null
}) => {
  const { handleOnSubmit, isLoading, message, answerEditor } = useCreateAnswer({ question, userId })

  return (
    <div className='min-h-full rounded-lg border border-solid border-slate-300'>
      <div className='flex items-center space-x-2 rounded-t-lg border-b border-l-0 border-r-0 border-t-0 border-solid border-slate-300 bg-[#f6f8fa] p-2'>
        <div className='relative h-10 w-10'>
          <Image
            src={profile && profile.avatar_url ? profile.avatar_url : '/default.png'}
            className='rounded-full object-cover'
            alt='avatar'
            fill
            sizes='auto'
            priority
          />
        </div>
        <span className='text-xl font-semibold text-slate-600'>回答する</span>
      </div>
      <div className='px-2 py-5'>
        <form onSubmit={handleOnSubmit}>
          <RichTextEditor
            editor={answerEditor}
            styles={{
              root: { border: '1px solid #cbd5e1', ':focus': { border: '1px solid #cbd5e1' } },
              content: {
                backgroundColor: '#f6f8fa',
                minHeight: '400px',
              },
            }}
          >
            <RichTextEditor.Content />
          </RichTextEditor>
          <div className='flex w-full justify-end px-3 pt-3'>
            <Button type='submit' variant='default' disabled={isLoading}>
              {isLoading && <ReloadIcon className='mr-2 h-4 w-4 animate-spin' />}
              {isLoading ? '回答を送信中' : '回答を送信'}
            </Button>
          </div>
        </form>
        {message && <div className='my-5 text-center text-sm text-red-500'>{message}</div>}
      </div>
    </div>
  )
}
