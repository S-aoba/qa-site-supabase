'use client'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { IconEdit, IconTrash } from '@tabler/icons-react'
import { useSetAtom } from 'jotai'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import type { CommentType } from '@/common/types'
import type { Database } from '@/lib/database.types'
import { editedCommentAtom } from '@/store/comment-atom'

import { CommentUpdateForm } from './comment-update-form'

export const Comment = ({ comment, userId }: { comment: CommentType; userId: string | undefined }) => {
  const supabase = createClientComponentClient<Database>()

  const [isEditMode, setIsEditMode] = useState(false)
  const setComment = useSetAtom(editedCommentAtom)
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleSetComment = () => {
    if (!isEditMode) {
      setComment(comment.content)
      setIsEditMode(true)
      return
    }
    setIsEditMode(false)
  }

  const handleDeleteComment = async () => {
    try {
      const { error: deleteCommentError } = await supabase.from('comments').delete().eq('id', comment.id)
      if (deleteCommentError) {
        setMessage('予期せぬエラーが発生しました。' + deleteCommentError.message)
        return
      }
      router.refresh()
    } catch (error) {
      setMessage('エラーが発生しました。' + error)
      return
    }
  }
  return (
    <div className='border-b-0 border-l-0 border-r-0 border-t border-solid border-slate-300'>
      <div className='flex justify-between space-x-2 bg-[#d3e0ec] p-2'>
        <div className='flex space-x-2'>
          <div className='relative h-6 w-6'>
            <Image
              src={comment.avatar_url !== null ? comment?.avatar_url : '/default.png'}
              className='rounded-full object-cover'
              alt='avatar'
              fill
              sizes='auto'
              priority
            />
          </div>
          <span>{comment?.username}</span>
        </div>
        {userId && userId === comment.user_id ? (
          <div className='flex space-x-2'>
            <IconEdit className='text-slate-500 hover:cursor-pointer hover:text-slate-700' onClick={handleSetComment} />
            <IconTrash className='text-slate-500 hover:cursor-pointer hover:text-slate-700' onClick={handleDeleteComment}/>
          </div>
        ) : null}
      </div>
      {isEditMode ? (
        <CommentUpdateForm commentId={comment.id} />
      ) : (
        comment && <div className='break-words px-2' dangerouslySetInnerHTML={{ __html: comment.content }} />
      )}
      {message && <div className='my-5 text-center text-sm text-red-500'>{message}</div>}
    </div>
  )
}
