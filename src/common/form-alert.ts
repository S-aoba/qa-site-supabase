import { useAtomValue } from 'jotai'
import { useEffect } from 'react'

import { editedAnswerAtom } from '@/store/answer-atom'
import { editedCommentAtom } from '@/store/comment-atom'

export const FormAlert = () => {
  const editedAnswerContent = useAtomValue(editedAnswerAtom)
  const editedCommentContent = useAtomValue(editedCommentAtom)

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (editedAnswerContent === '' && editedCommentContent === '') return
      e.preventDefault()
      e.returnValue = ''
      return true
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [editedAnswerContent, editedCommentContent])
}
