import { Button, Modal } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { IconEdit, IconTrash } from '@tabler/icons-react'
import type { SetStateAction } from 'jotai'
import { useSetAtom } from 'jotai'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { type Dispatch, useState } from 'react'

import type { QuestionType } from '@/common/types'
import type { Database } from '@/lib/database.types'
import { editedQuestionAtom, editedQuestionContentAtom, isEditModeAtom } from '@/store/question-atom'

export const QuestionActions = ({
  userId,
  question,
  setMessage,
}: {
  userId: string | undefined
  question: QuestionType | null
  setMessage: Dispatch<SetStateAction<string>>
}) => {
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(false)

  const [isDeleteQuestionOpened, { open: handleDeleteQuestionOpen, close: handleDeleteQuestionClose }] =
    useDisclosure(false)

  const setEditedQuestion = useSetAtom(editedQuestionAtom)
  const setQuestionDescription = useSetAtom(editedQuestionContentAtom)
  const setIsEditMode = useSetAtom(isEditModeAtom)
  const supabase = createClientComponentClient<Database>()
  const handleSetQuestion = () => {
    if (!question) return
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
    if (question === null) return
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
          </div>
          <div className='flex w-full justify-end gap-x-3'>
            <Button
              variant='default'
              type='button'
              onClick={handleDeleteQuestionClose}
              className=' hover:transform-none hover:border-black hover:bg-white'
            >
              キャンセル
            </Button>
            <Button
              type='button'
              className='bg-red-500 hover:transform-none hover:bg-red-500 hover:opacity-75'
              onClick={handleDeleteQuestion}
              loading={isLoading}
            >
              削除する
            </Button>
          </div>
        </div>
      </Modal>
      {userId === question?.user_id && (
        <div className='flex items-center space-x-2'>
          <Link href={'/questions/post'} className='flex items-center'>
            <IconEdit
              className='text-slate-500 hover:cursor-pointer hover:text-slate-700'
              onClick={handleSetQuestion}
            />
          </Link>
          <IconTrash
            className='text-slate-500 hover:cursor-pointer hover:text-slate-700'
            onClick={handleDeleteQuestionOpen}
          />
        </div>
      )}
    </>
  )
}
