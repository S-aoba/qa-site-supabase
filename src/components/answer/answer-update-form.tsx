'use client'

import { RichTextEditor } from '@mantine/tiptap'
import { ReloadIcon } from '@radix-ui/react-icons'

import { Button } from '../ui/button'
import { useUpdateAnswer } from './useUpdateAnswer'

export const AnswerUpdateForm = ({ answerId }: { answerId: string }) => {
  const { handleOnSubmit, isLoading, message, answerEditor } = useUpdateAnswer(answerId)

  return (
    <>
      <form className='py-2' onSubmit={handleOnSubmit}>
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
        <div className='flex w-full justify-end p-3'>
          <Button type='submit' variant='default' disabled={isLoading}>
            {isLoading && <ReloadIcon className='mr-2 h-4 w-4 animate-spin' />}
            {isLoading ? '回答を更新中' : '回答を更新'}
          </Button>
        </div>
      </form>
      {message && <div className='my-5 text-center text-sm text-red-500'>{message}</div>}
    </>
  )
}
