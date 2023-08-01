'use client'

import { RichTextEditor } from '@mantine/tiptap'
import { ReloadIcon } from '@radix-ui/react-icons'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useAtom, useSetAtom } from 'jotai'
import { useRouter } from 'next/navigation'
import type { FormEvent } from 'react'
import { useState } from 'react'

import { useContentEditor } from '@/common/hooks/useContentEditor'
import type { Database } from '@/lib/database.types'
import { editedCommentAtom, isCommentEditModeAtom } from '@/store/comment-atom'

import { Button } from '../ui/button'
import { useCommentFormAlert } from './useCommentFormAlert'

export const CommentUpdateForm = ({ commentId }: { commentId: string }) => {
  useCommentFormAlert()

  const supabase = createClientComponentClient<Database>()

  const [isLoading, setIsLoading] = useState(false)

  const setIsEditMode = useSetAtom(isCommentEditModeAtom)

  const { commentEditor } = useContentEditor()
  const [comment, setContent] = useAtom(editedCommentAtom)
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleOnSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!commentEditor) return

    setIsLoading(true)

    try {
      const { error: updateCommentError } = await supabase
        .from('comments')
        .update({
          content: comment,
        })
        .eq('id', commentId)
      if (updateCommentError) {
        setMessage('予期せぬエラーが発生しました。' + updateCommentError.message)
        return
      }
    } catch (error) {
      setMessage('エラーが発生しました。' + error)
      return
    } finally {
      setContent('')
      commentEditor.commands.setContent('')
      setIsLoading(false)
      setIsEditMode(false)
      router.refresh()
    }
  }

  return (
    <>
      <form className='p-2' onSubmit={handleOnSubmit}>
        <RichTextEditor
          editor={commentEditor}
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
            {isLoading ? 'コメントを更新中' : 'コメントを更新'}
          </Button>
        </div>
      </form>
      {message && <div className='my-5 text-center text-sm text-red-500'>{message}</div>}
    </>
  )
}
