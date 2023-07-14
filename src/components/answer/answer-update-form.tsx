'use client'

import { Button } from '@mantine/core'
import { RichTextEditor } from '@mantine/tiptap'

import { useUpdateAnswer } from './useUpdateAnswer'

export const AnswerUpdateForm = ({ answerId }: { answerId: string }) => {
  const { handleOnSubmit, isLoading, isDisabled, message, answerEditor } = useUpdateAnswer(answerId)

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
          <Button
            type='submit'
            className='bg-slate-500 hover:transform-none hover:bg-slate-600'
            loading={isLoading}
            disabled={isDisabled}
          >
            {isLoading ? '回答を更新中' : '回答を更新'}
          </Button>
        </div>
      </form>
      {message && <div className='my-5 text-center text-sm text-red-500'>{message}</div>}
    </>
  )
}
