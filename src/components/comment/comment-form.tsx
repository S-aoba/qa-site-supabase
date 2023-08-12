'use client'

import { ReloadIcon } from '@radix-ui/react-icons'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import type { z } from 'zod'

import { FormAlert } from '@/common/form-alert'
import { ReactHookForm } from '@/common/react-hook-form'
import type { commentSchema } from '@/common/schemas'
import type { AnswerType } from '@/common/types'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import type { Database } from '@/lib/database.types'
import { editedCommentAtom, isCommentEditModeAtom } from '@/store/comment-atom'
import { profileAtom } from '@/store/profile-atom'

import { Button } from '../ui/button'
import { ContentEditor } from '../ui/content-editor'

export const CommentForm = ({ answer, commentId }: { answer?: AnswerType; commentId?: string }) => {
  FormAlert()
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState('/default.png')

  const router = useRouter()

  const supabase = createClientComponentClient<Database>()

  const setIsEditMode = useSetAtom(isCommentEditModeAtom)
  const [editedCommentContent, setEditedCommentContent] = useAtom(editedCommentAtom)
  const user = useAtomValue(profileAtom)

  const { onHandleCommentForm } = ReactHookForm()

  const editor = useEditor({
    extensions: [StarterKit],
    content: editedCommentContent,
    onUpdate({ editor }) {
      onHandleCommentForm.setValue('content', editor.getHTML())
      setEditedCommentContent(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm m-2 pb-2 pl-5 dark:prose-invert sm:prose-base focus:outline-none',
      },
    },
  })

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
        setEditedCommentContent('')
        onHandleCommentForm.reset({ content: '' })
      }
      setIsLoading(false)
      setIsEditMode(false)
      router.refresh()
    }
  }
  return (
    <div className={`${commentId === undefined && 'border-t'} p-2`}>
      {commentId === undefined && (
        <div className='flex items-center space-x-2 text-foreground'>
          <div className='relative h-8 w-8'>
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
            render={() => {
              return (
                <FormItem>
                  <FormControl>
                    <ContentEditor editor={editor} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )
            }}
          />
          <div className='flex w-full justify-end px-3 pt-3'>
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
