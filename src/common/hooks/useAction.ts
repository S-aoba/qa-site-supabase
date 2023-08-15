import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useAtom, useSetAtom } from 'jotai'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import type { Database } from '@/lib/database.types'
import { editedAnswerAtom, isAnswerEditModeAtom } from '@/store/answer-atom'
import { editedCommentAtom, isCommentEditModeAtom } from '@/store/comment-atom'
import { editedQuestionAtom, isEditQuestionModeAtom } from '@/store/question-atom'

import type { ActionProps, AnswerType, CommentType, QuestionType } from '../types'

export const useAction = ({ question, answer, comment }: ActionProps) => {
  const [message, setMessage] = useState('')
  const [isShowDialog, setShowDialog] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const setEditedQuestion = useSetAtom(editedQuestionAtom)
  const setIsEditQuestionMode = useSetAtom(isEditQuestionModeAtom)

  const setEditedAnswer = useSetAtom(editedAnswerAtom)
  const [isEditAnswerMode, setIsEditAnswerMode] = useAtom(isAnswerEditModeAtom)

  const setEditedComment = useSetAtom(editedCommentAtom)
  const [isEditCommentMode, setIsEditCommentMode] = useAtom(isCommentEditModeAtom)

  const supabase = createClientComponentClient<Database>()
  const router = useRouter()

  const handleShowDialog = () => {
    setShowDialog(true)
  }

  const handleHideDialog = () => {
    setShowDialog(false)
  }

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

  const handleSetIsEditMode = (answer: AnswerType) => {
    if (!isEditAnswerMode) {
      setIsEditAnswerMode(true)
      setEditedAnswer(answer.content)
      return
    }
    setIsEditAnswerMode(false)
  }

  const handleSetComment = (comment: CommentType) => {
    if (!isEditCommentMode) {
      setEditedComment(comment.content)
      setIsEditCommentMode(true)
      return
    }
    setIsEditCommentMode(false)
  }

  const handleSetData = () => {
    if (question) {
      handleSetQuestion(question)
    } else if (answer) {
      handleSetIsEditMode(answer)
    } else if (comment) {
      handleSetComment(comment)
    }
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

  const handleDeleteComment = async (comment: CommentType) => {
    setIsLoading(true)
    try {
      const { error: deleteCommentError } = await supabase.from('comments').delete().eq('id', comment.id)
      if (deleteCommentError) {
        setMessage('予期せぬエラーが発生しました。' + deleteCommentError.message)
        return
      }
    } catch (error) {
      setMessage('エラーが発生しました。' + error)
      return
    } finally {
      setIsLoading(false)
      handleHideDialog()
      router.refresh()
    }
  }

  const handleDeleteData = () => {
    if (question) {
      handleDeleteQuestion(question)
    } else if (answer) {
      handleDeleteAnswer(answer)
    } else if (comment) {
      handleDeleteComment(comment)
    }
  }

  return {
    handleShowDialog,
    handleHideDialog,
    message,
    setMessage,
    isShowDialog,
    isLoading,
    setEditedComment,
    isEditCommentMode,
    setIsEditCommentMode,
    isEditAnswerMode,
    setIsEditAnswerMode,
    setEditedAnswer,
    setEditedQuestion,
    setIsEditQuestionMode,
    handleSetData,
    handleDeleteData,
  }
}
