'use client'

import { ReloadIcon } from '@radix-ui/react-icons'
import { IconEdit, IconMenu2, IconTrash } from '@tabler/icons-react'
import Link from 'next/link'
import { useState } from 'react'

import type { AnswerType, CommentType, QuestionType } from '@/common/types'

import { useAnswer } from '../answer/useAnswer'
import { useComment } from '../comment/useComment'
import { useQuestion } from '../question/useQuestion'
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

type ActionProps = {
  type: 'question' | 'default'
  question?: QuestionType
  answer?: AnswerType
  comment?: CommentType
}

export const Action = ({ type, question, answer, comment }: ActionProps) => {
  const [message, _] = useState('')
  const [isShowDialog, setShowDialog] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { handleDeleteQuestion, handleSetQuestion } = useQuestion(setIsLoading)
  const { handleDeleteAnswer, handleSetIsEditMode } = useAnswer(setIsLoading)
  const { handleDeleteComment, handleSetComment } = useComment(setIsLoading)

  const handleShowDialog = () => {
    return setShowDialog(true)
  }

  const handleHideDialog = () => {
    setShowDialog(false)
  }

  const handleSetData = () => {
    if (question) {
      handleSetQuestion(question)
    } else if (answer) {
      handleSetIsEditMode(answer)
    } else if (comment) {
      handleSetComment(comment)
    }
  }

  const handleDeleteData = () => {
    if (question) {
      handleDeleteQuestion(question)
    } else if (answer) {
      handleDeleteAnswer(answer)
    } else if (comment) {
      handleDeleteComment(comment)
    }
  }
  return (
    <AlertDialog open={isShowDialog} onOpenChange={handleHideDialog}>
      <div className='flex items-center'>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <IconMenu2 className='hover:cursor-pointer text-primary dark:brightness-75' />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={handleSetData} className='hover:cursor-pointer text-primary dark:brightness-75'>
              {type === 'question' ? (
                <Link href={'questions/edit'} className='flex items-center'>
                  <IconEdit className='mr-2' />
                  編集
                </Link>
              ) : (
                <>
                  <IconEdit className='mr-2' />
                  編集
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleShowDialog} className='hover:cursor-pointer text-primary dark:brightness-75'>
              <IconTrash className='mr-2' />
              削除
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className='text-primary dark:brightness-75'>削除してもよろしいですか？</AlertDialogTitle>
          <AlertDialogDescription>この手順は取り消すことはできません。</AlertDialogDescription>
          {message && <div className='my-5 text-center text-sm text-red-500'>{message}</div>}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>キャンセル</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteData}>
            {isLoading && <ReloadIcon className='mr-2 h-4 w-4 animate-spin' />}
            {isLoading ? '削除中' : '削除'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
