'use client'

import { Menu, Modal } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { IconEdit, IconMenu2, IconTrash } from '@tabler/icons-react'
import { useAtom, useSetAtom } from 'jotai'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import type { CommentType } from '@/common/types'
import type { Database } from '@/lib/database.types'
import { editedCommentAtom, isCommentEditModeAtom } from '@/store/comment-atom'

import { Button } from '../ui/button'

export const CommentActions = ({ comment }: { comment: CommentType }) => {
  const router = useRouter()

  const supabase = createClientComponentClient<Database>()

  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const setComment = useSetAtom(editedCommentAtom)
  const [isEditMode, setIsEditMode] = useAtom(isCommentEditModeAtom)

  const [isDeleteCommentOpened, { open: handleDeleteCommentOpen, close: handleDeleteAnswerClose }] =
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
      <Modal opened={isDeleteCommentOpened} onClose={handleDeleteAnswerClose} centered withCloseButton={false}>
        <div className='w-full p-5'>
          <div className='mb-4 border-b border-l-0 border-r-0 border-t-0 border-solid border-gray-200'>
            <div className='mb-4 flex flex-col rounded-md bg-gray-100 p-3'>
              <span>削除してもよろしいですか？</span>
              <span>この手順は取り消すことはできません。</span>
            </div>
            {message && <div className='my-5 text-center text-sm text-red-500'>{message}</div>}
          </div>
          <div className='flex w-full justify-end gap-x-3'>
            <Button type='button' variant='cancel' onClick={handleDeleteAnswerClose}>
              キャンセル
            </Button>
            <Button type='button' variant='delete' onClick={handleDeleteComment} loading={isLoading}>
              {isLoading ? '削除中' : '削除'}
            </Button>
          </div>
        </div>
      </Modal>
      <div className='flex items-center'>
        <Menu>
          <Menu.Target>
            <IconMenu2 className='hover:cursor-pointer hover:bg-slate-200' />
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item icon={<IconEdit />} onClick={handleSetComment}>
              編集
            </Menu.Item>
            <Menu.Item icon={<IconTrash />} onClick={handleDeleteCommentOpen}>
              削除
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </div>
    </>
  )
}
