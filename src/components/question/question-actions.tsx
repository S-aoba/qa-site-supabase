'use client'

import { ReloadIcon } from '@radix-ui/react-icons'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { IconEdit, IconMenu2, IconTrash } from '@tabler/icons-react'
import { useSetAtom } from 'jotai'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import type { QuestionType } from '@/common/types'
import type { Database } from '@/lib/database.types'
import { editedQuestionAtom, isEditModeAtom } from '@/store/question-atom'

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

export const QuestionActions = ({ question }: { question: QuestionType }) => {
  const supabase = createClientComponentClient<Database>()

  const router = useRouter()

  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isShowDialog, setShowDialog] = useState(false)

  const setEditedQuestion = useSetAtom(editedQuestionAtom)
  const setIsEditMode = useSetAtom(isEditModeAtom)

  const handleSetQuestion = () => {
    setEditedQuestion({
      id: question.id,
      title: question.title,
      coding_problem: question.coding_problem,
      tags: question.tags,
      content: question.content,
    })
    setIsEditMode(true)
  }

  const handleShowDialog = () => {
    setShowDialog(true)
  }

  const handleHideDialog = () => {
    setShowDialog(false)
  }

  const handleDeleteQuestion = async () => {
    setIsLoading(true)
    try {
      const { error } = await supabase.from('questions').delete().eq('id', question.id)
      if (error) {
        setMessage('予期せぬエラーが発生しました。' + error.message)
        return
      }
      handleHideDialog()
      router.push('/')
    } catch (error) {
      setMessage('エラーが発生しました。' + error)
      return
    } finally {
      setIsLoading(false)
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
            <DropdownMenuItem onClick={handleSetQuestion}>
              <Link href={'/questions/edit'} className='flex items-center text-black no-underline'>
                <IconEdit className='mr-2' />
                編集
              </Link>
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
          <AlertDialogAction onClick={handleDeleteQuestion}>
            {isLoading && <ReloadIcon className='mr-2 h-4 w-4 animate-spin' />}
            {isLoading ? '削除中' : '削除'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
