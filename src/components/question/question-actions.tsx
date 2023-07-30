'use client'

import { Modal } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { ReloadIcon } from '@radix-ui/react-icons'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { IconEdit, IconMenu2, IconTrash } from '@tabler/icons-react'
import { useSetAtom } from 'jotai'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import type { QuestionType } from '@/common/types'
import type { Database } from '@/lib/database.types'
import { editedQuestionAtom, editedQuestionContentAtom, isEditModeAtom } from '@/store/question-atom'

import { Button } from '../ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu'

export const QuestionActions = ({ question }: { question: QuestionType }) => {
  const supabase = createClientComponentClient<Database>()

  const router = useRouter()

  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const [isDeleteQuestionOpened, { open: handleDeleteQuestionOpen, close: handleDeleteQuestionClose }] =
    useDisclosure(false)

  const setEditedQuestion = useSetAtom(editedQuestionAtom)
  const setQuestionDescription = useSetAtom(editedQuestionContentAtom)
  const setIsEditMode = useSetAtom(isEditModeAtom)

  const handleSetQuestion = () => {
    setQuestionDescription(question.content)
    setEditedQuestion({
      id: question.id,
      title: question.title,
      coding_problem: question.coding_problem,
      tags: question.tags,
    })
    setIsEditMode(true)
  }

  const handleDeleteQuestion = async () => {
    setIsLoading(true)
    try {
      const { error } = await supabase.from('questions').delete().eq('id', question.id)
      if (error) {
        setMessage('予期せぬエラーが発生しました。' + error.message)
        return
      }
      handleDeleteQuestionClose()
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
    <>
      <Modal opened={isDeleteQuestionOpened} onClose={handleDeleteQuestionClose} centered withCloseButton={false}>
        <div className='w-full p-5'>
          <div className='mb-4 border-b border-l-0 border-r-0 border-t-0 border-solid border-gray-200'>
            <div className='mb-4 flex flex-col rounded-md bg-gray-100 p-3'>
              <span>削除してもよろしいですか？</span>
              <span>この手順は取り消すことはできません。</span>
            </div>
            {message && <div className='my-5 text-center text-sm text-red-500'>{message}</div>}
          </div>
          <div className='flex w-full justify-end gap-x-3'>
            <Button type='button' variant='outline' onClick={handleDeleteQuestionClose}>
              キャンセル
            </Button>
            <Button type='button' variant='destructive' onClick={handleDeleteQuestion} disabled={isLoading}>
              {isLoading && <ReloadIcon className='mr-2 h-4 w-4 animate-spin' />}
              {isLoading ? '削除中' : '削除'}
            </Button>
          </div>
        </div>
      </Modal>
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
            <DropdownMenuItem onClick={handleDeleteQuestionOpen}>
              <IconTrash className='mr-2' />
              削除
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  )
}
