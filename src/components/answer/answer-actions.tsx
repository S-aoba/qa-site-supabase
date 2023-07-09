import { Button, Modal } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { IconEdit, IconTrash } from '@tabler/icons-react'
import { useSetAtom } from 'jotai'
import { useRouter } from 'next/navigation'
import type { Dispatch, SetStateAction } from 'react'
import { useState } from 'react'

import type { AnswerType } from '@/common/types'
import type { Database } from '@/lib/database.types'
import { editedAnswerAtom } from '@/store/answer-atom'

export const AnswerActions = ({
  userId,
  answer,
  isEditMode,
  setIsEditMode,
}: {
  userId: string | undefined
  answer: AnswerType
  isEditMode: boolean
  setIsEditMode: Dispatch<SetStateAction<boolean>>
}) => {
  const supabase = createClientComponentClient<Database>()

  const [isLoading, setIsLoading] = useState(false)

  const [isDeleteAnswerOpened, { open: handleDeleteQuestionOpen, close: handleDeleteAnswerClose }] =
    useDisclosure(false)

  const router = useRouter()
  const [_, setMessage] = useState('')
  const setEditedAnswer = useSetAtom(editedAnswerAtom)

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
              onClick={handleDeleteAnswer}
              loading={isLoading}
            >
              削除する
            </Button>
          </div>
        </div>
      </Modal>
      {userId === answer.user_id && (
        <div className='flex items-center space-x-2'>
          <IconEdit
            className='text-slate-500 hover:cursor-pointer hover:text-slate-700'
            onClick={handleSetIsEditMode}
          />
          <IconTrash
            className='text-slate-500 hover:cursor-pointer hover:text-slate-700'
            onClick={handleDeleteQuestionOpen}
          />
        </div>
      )}
    </>
  )
}
