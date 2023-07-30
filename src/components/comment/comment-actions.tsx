'use client'

import { ReloadIcon } from '@radix-ui/react-icons'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { IconEdit, IconMenu2, IconTrash } from '@tabler/icons-react'
import { useAtom, useSetAtom } from 'jotai'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import type { CommentType } from '@/common/types'
import type { Database } from '@/lib/database.types'
import { editedCommentAtom, isCommentEditModeAtom } from '@/store/comment-atom'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu'

export const CommentActions = ({ comment }: { comment: CommentType }) => {
  const router = useRouter()

  const supabase = createClientComponentClient<Database>()

  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isShowDialog, setShowDialog] = useState(false)

  const setComment = useSetAtom(editedCommentAtom)
  const [isEditMode, setIsEditMode] = useAtom(isCommentEditModeAtom)

  const handleShowDialog = () => {
    setShowDialog(true)
  }

  const handleHideDialog = () => {
    setShowDialog(false)
  }

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
      handleHideDialog()
      router.refresh()
    }
  }
  return (
    <AlertDialog open={isShowDialog} onOpenChange={handleHideDialog}>
      <div className='flex items-center'>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <IconMenu2 className='hover:cursor-pointer hover:bg-slate-200' />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={handleSetComment}>
              <IconEdit className='mr-2' />
              編集
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleShowDialog}>
              <IconTrash className='mr-2' />
              削除
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>削除してもよろしいですか？</AlertDialogTitle>
          <AlertDialogDescription>この手順は取り消すことはできません。</AlertDialogDescription>
          {message && <div className='my-5 text-center text-sm text-red-500'>{message}</div>}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleHideDialog}>キャンセル</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteComment}>
            {isLoading && <ReloadIcon className='mr-2 h-4 w-4 animate-spin' />}
            {isLoading ? '削除中' : '削除'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
