'use client'

import { ReloadIcon } from '@radix-ui/react-icons'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { IconEdit, IconMenu2, IconTrash } from '@tabler/icons-react'
import { useAtom, useSetAtom } from 'jotai'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import type { AnswerType } from '@/common/types'
import type { Database } from '@/lib/database.types'
import { editedAnswerAtom, isAnswerEditModeAtom } from '@/store/answer-atom'

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

export const AnswerActions = ({ answer }: { answer: AnswerType }) => {
  const supabase = createClientComponentClient<Database>()

  const [isEditMode, setIsEditMode] = useAtom(isAnswerEditModeAtom)

  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()

  const [message, setMessage] = useState('')
  const [isShowDialog, setShowDialog] = useState(false)

  const setEditedAnswer = useSetAtom(editedAnswerAtom)

  const handleShowDialog = () => {
    setShowDialog(true)
  }

  const handleHideDialog = () => {
    setShowDialog(false)
  }
  const handleDeleteAnswer = async () => {
    setIsLoading(true)
    try {
      const { error: deleteAnswerError } = await supabase.from('answers').delete().eq('id', answer.id)
      if (deleteAnswerError) {
        setMessage('予期せぬエラーが発生しました。' + deleteAnswerError.message)
        return
      }

      // 回答が他にも存在するかどうか確認
      const { data: otherAnswers, error: otherAnswersError } = await supabase
        .from('answers')
        .select('*')
        .eq('question_id', answer.question_id)

      if (otherAnswersError) {
        setMessage('予期せぬエラーが発生しました。' + otherAnswersError.message)
        return
      }
      // 回答が存在していなければ、質問を募集中テーブルに追加
      if (otherAnswers.length === 0) {
        const { error: questionWaitingAnswersError } = await supabase.from('question_waiting_answers').insert({
          question_id: answer.question_id,
        })
        if (questionWaitingAnswersError) {
          setMessage('予期せぬエラーが発生しました。' + questionWaitingAnswersError.message)
        }
      }

      setEditedAnswer('')
    } catch (error) {
      setMessage('エラーが発生しました。' + error)
      return
    } finally {
      setIsLoading(false)
      handleHideDialog()
      router.refresh()
    }
  }

  const handleSetIsEditMode = () => {
    if (!isEditMode) {
      setIsEditMode(true)
      setEditedAnswer(answer.content)
      return
    }
    setIsEditMode(false)
  }
  return (
      <AlertDialog open={isShowDialog} onOpenChange={handleHideDialog}>
        <div className='flex items-center'>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <IconMenu2 className='hover:cursor-pointer hover:bg-slate-200' />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={handleSetIsEditMode}>
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
            <AlertDialogAction onClick={handleDeleteAnswer}>
              {isLoading && <ReloadIcon className='mr-2 h-4 w-4 animate-spin' />}
              {isLoading ? '削除中' : '削除'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
  )
}
