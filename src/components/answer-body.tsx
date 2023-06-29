import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { IconEdit, IconTrash } from '@tabler/icons-react'
import { useAtom, useSetAtom } from 'jotai'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import type { AnswerType, QuestionType } from '@/common/types'
import type { Database } from '@/lib/database.types'
import { editedAnswerAtom } from '@/store/answer-atom'
import { isEditModeAtom } from '@/store/question-atom'

import { Content } from './answer-content'

export const AnswerBody = async ({
  answer,
  userId,
  question,
}: {
  answer: AnswerType
  userId: string | undefined
  question: QuestionType
}) => {
  const router = useRouter()
  const [_, setMessage] = useState('')
  const setEditedAnswer = useSetAtom(editedAnswerAtom)
  const [isEditMode, setIsEditMode] = useAtom(isEditModeAtom)

  const supabase = createClientComponentClient<Database>()
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', answer?.user_id).single()

  const handleDeleteAnswer = async () => {
    try {
      const { error: deleteAnswerError } = await supabase.from('answers').delete().eq('id', answer.id)
      if (deleteAnswerError) {
        setMessage('予期せぬエラーが発生しました。' + deleteAnswerError.message)
        return
      }

      const newAnsweredList = question.answered_list?.filter((id) => {
        return id !== answer.id
      })
      const { error: updateQuestionError } = await supabase
        .from('questions')
        .update({
          answered_list: newAnsweredList,
        })
        .eq('id', question.id)

      if (updateQuestionError) {
        setMessage('予期せぬエラーが発生しました。' + updateQuestionError.message)
        return
      }
      setEditedAnswer('')
    } catch (error) {
      setMessage('エラーが発生しました。' + error)
      return
    } finally {
      router.refresh()
    }
  }

  const handleSetIsEditMode = () => {
    setIsEditMode({ ...isEditMode, answer: !isEditMode.answer })
    setEditedAnswer(answer.content)
  }

  return (
    <div className='rounded-lg border border-solid border-slate-300 pb-5'>
      <div className='rounded-t-lg border-b border-l-0 border-r-0 border-t-0 border-solid border-slate-300 bg-[#f6f8fa] px-2'>
        <div className='flex justify-between'>
          <div className='flex items-center space-x-2'>
            <div className='relative h-6 w-6'>
              <Image
                src={profile && profile.avatar_url ? profile.avatar_url : '/default.png'}
                className='rounded-full object-cover'
                alt='avatar'
                fill
                sizes='auto'
                priority
              />
            </div>
            <div>
              <p className='text-sm'>{profile?.username}</p>
            </div>
            <div>
              <span className='text-sm'>投稿日: {answer.created_at.slice(0, 10)}</span>
            </div>
          </div>
          {userId === answer.user_id && (
            <div className='flex items-center space-x-2'>
              <IconEdit
                className='text-slate-500 hover:cursor-pointer hover:text-slate-700'
                onClick={handleSetIsEditMode}
              />
              <IconTrash
                className='text-slate-500 hover:cursor-pointer hover:text-slate-700'
                onClick={handleDeleteAnswer}
              />
            </div>
          )}
        </div>
      </div>
      <Content answer={answer} isEditMode={isEditMode} userId={userId} />
    </div>
  )
}
