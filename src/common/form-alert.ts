import { useAtomValue } from 'jotai'
import { useCallback, useEffect, useMemo } from 'react'

import { editedAnswerAtom } from '@/store/answer-atom'
import { editedCommentAtom } from '@/store/comment-atom'
import { editedQuestionAtom } from '@/store/question-atom'

export const FormAlert = () => {
  const editedQuestion = useAtomValue(editedQuestionAtom)
  const editedAnswerContent = useAtomValue(editedAnswerAtom)
  const editedCommentContent = useAtomValue(editedCommentAtom)

  const initialEditedQuestion = useMemo(() => {
    return {
      id: '',
      title: '',
      tags: [],
      coding_problem: '',
      content: '',
    }
  }, [])

  const handleBeforeUnload = useCallback(
    (e: BeforeUnloadEvent) => {
      const isAnswerEdited = editedAnswerContent !== ''
      const isCommentEdited = editedCommentContent !== ''
      const isQuestionEdited = JSON.stringify(editedQuestion) !== JSON.stringify(initialEditedQuestion)

      if (isAnswerEdited || isCommentEdited || isQuestionEdited) {
        e.preventDefault()
        e.returnValue = ''
        return true
      }
    },
    [editedAnswerContent, editedCommentContent, editedQuestion, initialEditedQuestion]
  )

  useEffect(() => {
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [handleBeforeUnload])
}
