import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import type { Dispatch, SetStateAction } from 'react'

import { useAction } from '@/common/hooks/useAction'
import type { AnswerType } from '@/common/types'
import type { Database } from '@/lib/database.types'

export const useAnswer = (setIsLoading: Dispatch<SetStateAction<boolean>>) => {
  const router = useRouter()
  const supabase = createClientComponentClient<Database>()

  const { isEditAnswerMode, setEditedAnswer, setIsEditAnswerMode, setMessage, handleHideDialog } = useAction()

  const handleSetIsEditMode = (answer: AnswerType) => {
    if (!isEditAnswerMode) {
      setIsEditAnswerMode(true)
      setEditedAnswer(answer.content)
      return
    }
    setIsEditAnswerMode(false)
  }

  const handleDeleteAnswer = async (answer: AnswerType) => {
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
  return { handleDeleteAnswer, handleSetIsEditMode }
}
