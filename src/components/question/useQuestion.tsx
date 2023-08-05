import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import type { Dispatch, SetStateAction } from 'react'

import { useAction } from '@/common/hooks/useAction'
import type { QuestionType } from '@/common/types'
import type { Database } from '@/lib/database.types'

export const useQuestion = (setIsLoading: Dispatch<SetStateAction<boolean>>) => {
  const router = useRouter()
  const supabase = createClientComponentClient<Database>()

  const { setEditedQuestion, setIsEditQuestionMode, setMessage, handleHideDialog } = useAction()

  const handleSetQuestion = (question: QuestionType) => {
    setEditedQuestion({
      id: question.id,
      title: question.title,
      coding_problem: question.coding_problem,
      tags: question.tags,
      content: question.content,
    })
    setIsEditQuestionMode(true)
  }

  const handleDeleteQuestion = async (question: QuestionType) => {
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

  return { handleSetQuestion, handleDeleteQuestion }
}
