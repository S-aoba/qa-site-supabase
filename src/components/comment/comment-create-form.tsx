'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { ReloadIcon } from '@radix-ui/react-icons'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useAtomValue } from 'jotai'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import type * as z from 'zod'

import { commentSchema } from '@/common/schemas'
import type { AnswerType } from '@/common/types'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import type { Database } from '@/lib/database.types'
import { editedCommentAtom } from '@/store/comment-atom'
import { profileAtom } from '@/store/profile-atom'

import { Button } from '../ui/button'
import { ContentEditor } from '../ui/content-editor'
import { useCommentFormAlert } from './useCommentFormAlert'

export const CommentCreateForm = ({ answer }: { answer: AnswerType }) => {
  useCommentFormAlert()

  const supabase = createClientComponentClient<Database>()

  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const user = useAtomValue(profileAtom)
  const router = useRouter()
  const [avatarUrl, setAvatarUrl] = useState('/default.png')

  const content = useAtomValue(editedCommentAtom)
  const onHandleForm = useForm<z.infer<typeof commentSchema>>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      content,
    },
  })
  // アバター画像の取得
  useEffect(() => {
    if (user && user.avatar_url) {
      setAvatarUrl(user.avatar_url)
    }
  }, [user])

  const handleCreateComment = async (values: z.infer<typeof commentSchema>) => {
    setIsLoading(true)
    const { content } = values

    try {
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
      {
        <div className='border-b-0 border-l-0 border-r-0 border-t border-solid border-slate-300 p-2'>
          <div className='flex items-center space-x-2  pt-2 font-semibold text-slate-400'>
            <div className='relative h-6 w-6'>
              <Image src={avatarUrl} className='rounded-full object-cover' alt='avatar' fill sizes='auto' priority />
            </div>
            <span>コメントする</span>
          </div>
          <Form {...onHandleForm}>
            <form className='pt-2' onSubmit={onHandleForm.handleSubmit(handleCreateComment)}>
              <FormField
                control={onHandleForm.control}
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
                  {isLoading ? 'コメントを投稿中' : 'コメントを投稿'}
                </Button>
              </div>
            </form>
            {message && <div className='my-5 text-center text-sm text-red-500'>{message}</div>}
          </Form>
        </div>
      }
    </>
  )
}
