'use client'

import { ReloadIcon } from '@radix-ui/react-icons'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useAtomValue, useSetAtom } from 'jotai'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type * as z from 'zod'

import { ReactHookForm } from '@/common/react-hook-form'
import type { commentSchema } from '@/common/schemas'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import type { Database } from '@/lib/database.types'
import { editedCommentAtom, isCommentEditModeAtom } from '@/store/comment-atom'

import { Button } from '../ui/button'
import { ContentEditor } from '../ui/content-editor'
import { useCommentFormAlert } from './useCommentFormAlert'

export const CommentUpdateForm = ({ commentId }: { commentId: string }) => {
  useCommentFormAlert()
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()

  const supabase = createClientComponentClient<Database>()

  const setIsEditMode = useSetAtom(isCommentEditModeAtom)
  const content = useAtomValue(editedCommentAtom)

  const { onHandleCommentForm } = ReactHookForm()

  const handleUpdateComment = async (values: z.infer<typeof commentSchema>) => {
    setIsLoading(true)
    const { content } = values

    try {
      const { error: updateCommentError } = await supabase
        .from('comments')
        .update({
          content,
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
      setIsEditMode(false)
      router.refresh()
    }
  }

  return (
    <Form {...onHandleCommentForm}>
      <form className='p-2' onSubmit={onHandleCommentForm.handleSubmit(handleUpdateComment)}>
        <FormField
          control={onHandleCommentForm.control}
          name='content'
          render={({ field }) => {
            return (
              <FormItem>
                <FormControl>
                  <ContentEditor handleOnChange={field.onChange} content={content} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )
          }}
        />
        <div className='flex w-full justify-end p-3'>
          <Button type='submit' variant='default' disabled={isLoading}>
            {isLoading && <ReloadIcon className='mr-2 h-4 w-4 animate-spin' />}
            {isLoading ? 'コメントを更新中' : 'コメントを更新'}
          </Button>
        </div>
      </form>
      {message && <div className='my-5 text-center text-sm text-red-500'>{message}</div>}
    </Form>
  )
}
