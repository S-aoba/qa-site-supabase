'use client'

import { ReloadIcon } from '@radix-ui/react-icons'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import type { z } from 'zod'

import { useContentEditor } from '@/common/hooks/useContentEditor'
import { ReactHookForm } from '@/common/react-hook-form'
import type { commentSchema } from '@/common/schemas'
import type { AnswerType } from '@/common/types'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import type { Database } from '@/lib/database.types'
import { editedCommentAtom, isCommentEditModeAtom } from '@/store/comment-atom'
import { profileAtom } from '@/store/profile-atom'

import { Button } from '../ui/button'
import { ContentEditor } from '../ui/content-editor'
import { useCommentFormAlert } from './useCommentFormAlert'

export const CommentForm = ({ answer, commentId }: { answer?: AnswerType; commentId?: string }) => {
  useCommentFormAlert()
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState('/default.png')

  const router = useRouter()

  const supabase = createClientComponentClient<Database>()

  const setIsEditMode = useSetAtom(isCommentEditModeAtom)
  const [content, setContent] = useAtom(editedCommentAtom)
  const user = useAtomValue(profileAtom)

  const { onHandleCommentForm } = ReactHookForm()

  const { editor } = useContentEditor({ content })

  // アバター画像の取得
  useEffect(() => {
    if (user && user.avatar_url) {
      setAvatarUrl(user.avatar_url)
    }
  }, [user])

  const handleOnSubmit = async (values: z.infer<typeof commentSchema>) => {
    setIsLoading(true)
    const { content } = values

    try {
      if (commentId === undefined && answer) {
        const { error: createCommentError } = await supabase
          .from('comments')
          .insert({
            user_id: user.id,
            answer_id: answer.id,
            username: user.username,
            avatar_url: user.avatar_url,
            content,
          })
          .select('*')
          .single()
        if (createCommentError) {
          setMessage('予期せぬエラーが発生しました。' + createCommentError.message)
          return
        }
      } else {
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
      }
    } catch (error) {
      setMessage('エラーが発生しました。' + error)
      return
    } finally {
      if (editor) {
        editor.commands.clearContent()
        setContent('')
        onHandleCommentForm.reset({ content: '' })
      }
      setIsLoading(false)
      setIsEditMode(false)
      router.refresh()
    }
  }
  return (
    <div
      className={`${
        commentId === undefined && ' border-b-0 border-l-0 border-r-0 border-t border-solid border-slate-300 '
      } p-2`}
    >
      {commentId === undefined && (
        <div className='flex items-center space-x-2  pt-2 font-semibold text-slate-400'>
          <div className='relative h-6 w-6'>
            <Image src={avatarUrl} className='rounded-full object-cover' alt='avatar' fill sizes='auto' priority />
          </div>
          <span>コメントする</span>
        </div>
      )}
      <Form {...onHandleCommentForm}>
        <form className='p-2' onSubmit={onHandleCommentForm.handleSubmit(handleOnSubmit)}>
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
            {commentId === undefined ? (
              <Button type='submit' variant='default' disabled={isLoading}>
                {isLoading && <ReloadIcon className='mr-2 h-4 w-4 animate-spin' />}
                {isLoading ? 'コメントを送信中' : 'コメントを送信'}
              </Button>
            ) : (
              <Button type='submit' variant='default' disabled={isLoading}>
                {isLoading && <ReloadIcon className='mr-2 h-4 w-4 animate-spin' />}
                {isLoading ? 'コメントを更新中' : 'コメントを更新'}
              </Button>
            )}
          </div>
        </form>
        {message && <div className='my-5 text-center text-sm text-red-500'>{message}</div>}
      </Form>
    </div>
  )
}
