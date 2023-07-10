'use client'
import { Button } from '@mantine/core'
import { RichTextEditor } from '@mantine/tiptap'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useAtomValue } from 'jotai'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { useContentEditor } from '@/common/hooks/useContentEditor'
import type { Database } from '@/lib/database.types'
import { editedCommentAtom } from '@/store/comment-atom'

export const CommentUpdateForm = ({ commentId }: { commentId: string }) => {
  const supabase = createClientComponentClient<Database>()

  const [isLoading, setIsLoading] = useState(false)
  const { commentEditor } = useContentEditor({ type: 'comment' })
  const comment = useAtomValue(editedCommentAtom)
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleOnSubmit = async () => {
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
      setIsLoading(false)
      router.refresh()
    }
  }

  return (
    <>
      <form className='p-2' onSubmit={handleOnSubmit}>
        <RichTextEditor
          editor={commentEditor}
          className=' min-h-[400px] w-full rounded-md border border-solid border-slate-300 shadow'
        >
          <RichTextEditor.Content />
        </RichTextEditor>
        <div className='flex w-full justify-end p-3'>
          <Button type='submit' className='bg-slate-500 hover:transform-none hover:bg-slate-600' loading={isLoading}>
            {isLoading ? 'コメントを更新中' : 'コメントを更新'}
          </Button>
        </div>
      </form>
      {message && <div className='my-5 text-center text-sm text-red-500'>{message}</div>}
    </>
  )
}
