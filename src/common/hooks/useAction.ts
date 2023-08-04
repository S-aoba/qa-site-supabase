import { useAtom, useSetAtom } from 'jotai'
import { useState } from 'react'

import { editedAnswerAtom, isAnswerEditModeAtom } from '@/store/answer-atom'
import { editedCommentAtom, isCommentEditModeAtom } from '@/store/comment-atom'
import { editedQuestionAtom, isEditModeAtom } from '@/store/question-atom'

export const useAction = () => {
  const [message, setMessage] = useState('')
  const [isShowDialog, setShowDialog] = useState(false)

  const setEditedQuestion = useSetAtom(editedQuestionAtom)
  const setIsEditQuestionMode = useSetAtom(isEditModeAtom)

  const [isEditAnswerMode, setIsEditAnswerMode] = useAtom(isAnswerEditModeAtom)
  const setEditedAnswer = useSetAtom(editedAnswerAtom)

  const setComment = useSetAtom(editedCommentAtom)
  const [isEditCommentMode, setIsEditCommentMode] = useAtom(isCommentEditModeAtom)

  const handleShowDialog = () => {
    setShowDialog(true)
  }

  const handleHideDialog = () => {
    setShowDialog(false)
  }

  return {
    handleShowDialog,
    handleHideDialog,
    message,
    setMessage,
    isShowDialog,
    setComment,
    isEditCommentMode,
    setIsEditCommentMode,
    isEditAnswerMode,
    setIsEditAnswerMode,
    setEditedAnswer,
    setEditedQuestion,
    setIsEditQuestionMode,
  }
}
