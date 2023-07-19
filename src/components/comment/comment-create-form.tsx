'use client'

import { RichTextEditor } from '@mantine/tiptap'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useAtom, useAtomValue } from 'jotai'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import type { FormEvent } from 'react'
import { useEffect, useState } from 'react'

import { useContentEditor } from '@/common/hooks/useContentEditor'
import type { AnswerType } from '@/common/types'
import type { Database } from '@/lib/database.types'
import { editedCommentAtom } from '@/store/comment-atom'
import { profileAtom } from '@/store/profile-atom'

import { Button } from '../ui/button'
import { useCommentFormAlert } from './useCommentFormAlert'

export const CommentCreateForm = ({ answer }: { answer: AnswerType }) => {
  useCommentFormAlert()

  const supabase = createClientComponentClient<Database>()

  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isDisabled, setIsDisabled] = useState(true)
  const { commentEditor } = useContentEditor(setIsDisabled)
  const user = useAtomValue(profileAtom)
  const router = useRouter()
  const [avatarUrl, setAvatarUrl] = useState('/default.png')

  const [content, setContent] = useAtom(editedCommentAtom)

  // アバター画像の取得
  useEffect(() => {
    if (user && user.avatar_url) {
      setAvatarUrl(user.avatar_url)
    }
  }, [user])

  const handleCreateComment = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!commentEditor) return

    setIsLoading(true)
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
      setContent('')
      commentEditor.commands.setContent('')
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
          <form className='pt-2' onSubmit={handleCreateComment}>
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
              <Button type='submit' variant='submit' loading={isLoading}>
                {isLoading ? 'コメントを投稿中' : 'コメントを投稿'}
              </Button>
            </div>
          </form>
          {message && <div className='my-5 text-center text-sm text-red-500'>{message}</div>}
        </div>
      }
    </>
  )
}
