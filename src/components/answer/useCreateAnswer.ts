'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useAtom, useAtomValue } from 'jotai'
import { useRouter } from 'next/navigation'
import { type FormEvent, useState } from 'react'

import { useContentEditor } from '@/common/hooks/useContentEditor'
import type { QuestionType } from '@/common/types'
import { useAnswerFormAlert } from '@/components/answer/useAnswerFormAlert'
import type { Database } from '@/lib/database.types'
import { editedAnswerAtom } from '@/store/answer-atom'
import { profileAtom } from '@/store/profile-atom'

export const useCreateAnswer = ({ question, userId }: { question: QuestionType; userId: string }) => {
  useAnswerFormAlert()

  const [isLoading, setLoading] = useState(false)
  const [isDisabled, setIsDisabled] = useState(true)
  const [message, setMessage] = useState('')
  const router = useRouter()

  const supabase = createClientComponentClient<Database>()

  const { answerEditor } = useContentEditor(setIsDisabled)

  const user = useAtomValue(profileAtom)
  const [answerContent, setAnswerContent] = useAtom(editedAnswerAtom)

  const handleOnSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!answerEditor) return

    setLoading(true)

    try {
      const { data: answer, error: createAnswerError } = await supabase
        .from('answers')
        .upsert({
          user_id: userId,
          question_id: question.id,
          content: answerContent,
        })
        .select()
        .single()

      if (createAnswerError) {
        setMessage('予期せぬエラーが発生しました。' + createAnswerError.message)
        return
      }

      const { error: createNotificationError } = await supabase.from('notifications').insert({
        user_id: question.user_id,
        question_id: question.id,
        username: user.username,
        title: question.title,
        avatar_url: user.avatar_url,
        answer_id: answer.id,
      })
      if (createNotificationError) {
        setMessage('予期せぬエラーが発生しました。' + createNotificationError.message)
        return
      }

      // 質問募集中テーブルから該当の質問を削除
      const { error: deleteQuestionError } = await supabase
        .from('question_waiting_answers')
        .delete()
        .eq('question_id', question.id)

      if (deleteQuestionError) {
        setMessage('予期せぬエラーが発生しました。' + deleteQuestionError.message)
        return
      }
    } catch (error) {
      setMessage('エラーが発生しました。' + error)
      return
    } finally {
      setAnswerContent('')
      answerEditor.commands.setContent('')
      setLoading(false)
      router.refresh()
    }
  }

  return { handleOnSubmit, isLoading, isDisabled, message, answerEditor }
}
