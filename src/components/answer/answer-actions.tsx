'use client'

import { Menu, Modal } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { IconEdit, IconMenu2, IconTrash } from '@tabler/icons-react'
import { useAtom, useSetAtom } from 'jotai'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import type { AnswerType } from '@/common/types'
import type { Database } from '@/lib/database.types'
import { editedAnswerAtom, isAnswerEditModeAtom } from '@/store/answer-atom'

import { Button } from '../ui/button'

export const AnswerActions = ({ answer }: { answer: AnswerType }) => {
  const supabase = createClientComponentClient<Database>()

  const [isEditMode, setIsEditMode] = useAtom(isAnswerEditModeAtom)

  const [isLoading, setIsLoading] = useState(false)

  const [isDeleteAnswerOpened, { open: handleDeleteAnswerOpen, close: handleDeleteAnswerClose }] = useDisclosure(false)

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
      handleDeleteAnswerClose()
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
            <Button type='button' variant='cancel' onClick={handleDeleteAnswerClose}>
              キャンセル
            </Button>
            <Button type='button' variant='delete' onClick={handleDeleteAnswer} loading={isLoading}>
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
            <Menu.Item icon={<IconEdit />} onClick={handleSetIsEditMode}>
              編集
            </Menu.Item>
            <Menu.Item icon={<IconTrash />} onClick={handleDeleteAnswerOpen}>
              削除
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </div>
    </>
  )
}
