'use client'

import { Button, Modal } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { IconEdit, IconTrash } from '@tabler/icons-react'
import type { SetStateAction } from 'jotai'
import { useSetAtom } from 'jotai'
import { useRouter } from 'next/navigation'
import { type Dispatch, useState } from 'react'

import type { CommentType } from '@/common/types'
import type { Database } from '@/lib/database.types'
import { editedCommentAtom } from '@/store/comment-atom'

export const CommentActions = ({
  userId,
  comment,
  isEditMode,
  setIsEditMode,
  setMessage,
}: {
  userId: string | undefined
  comment: CommentType
  isEditMode: boolean
  setIsEditMode: Dispatch<SetStateAction<boolean>>
  setMessage: Dispatch<SetStateAction<string>>
}) => {
  const router = useRouter()
  const supabase = createClientComponentClient<Database>()
  const setComment = useSetAtom(editedCommentAtom)

  const [isLoading, setIsLoading] = useState(false)

  const [isDeleteAnswerOpened, { open: handleDeleteQuestionOpen, close: handleDeleteAnswerClose }] =
    useDisclosure(false)

  const handleSetComment = () => {
    if (!isEditMode) {
      setComment(comment.content)
      setIsEditMode(true)
      return
    }
    setIsEditMode(false)
  }

  const handleDeleteComment = async () => {
    setIsLoading(true)
    try {
      const { error: deleteCommentError } = await supabase.from('comments').delete().eq('id', comment.id)
      if (deleteCommentError) {
        setMessage('予期せぬエラーが発生しました。' + deleteCommentError.message)
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
      <Modal opened={isDeleteAnswerOpened} onClose={handleDeleteAnswerClose} centered withCloseButton={false}>
        <div className='w-full p-5'>
          <div className='mb-4 border-b border-l-0 border-r-0 border-t-0 border-solid border-gray-200'>
            <div className='mb-4 flex flex-col rounded-md bg-gray-100 p-3'>
              <span>削除してもよろしいですか？</span>
              <span>この手順は取り消すことはできません。</span>
            </div>
          </div>
          <div className='flex w-full justify-end gap-x-3'>
            <Button
              variant='default'
              type='button'
              onClick={handleDeleteAnswerClose}
              className=' hover:transform-none hover:border-black hover:bg-white'
            >
              キャンセル
            </Button>
            <Button
              type='button'
              className='bg-red-500 hover:transform-none hover:bg-red-500 hover:opacity-75'
              onClick={handleDeleteComment}
              loading={isLoading}
            >
              {isLoading ? '削除中' : '削除'}
            </Button>
          </div>
        </div>
      </Modal>
      {userId === comment.user_id && (
        <div className='flex space-x-2'>
          <IconEdit className='text-slate-500 hover:cursor-pointer hover:text-slate-700' onClick={handleSetComment} />
          <IconTrash
            className='text-slate-500 hover:cursor-pointer hover:text-slate-700'
            onClick={handleDeleteQuestionOpen}
          />
        </div>
      )}
    </>
  )
}
