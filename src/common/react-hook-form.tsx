import { zodResolver } from '@hookform/resolvers/zod'
import { useAtomValue } from 'jotai'
import { useForm } from 'react-hook-form'
import type * as z from 'zod'

import { editedAnswerAtom } from '@/store/answer-atom'
import { editedCommentAtom } from '@/store/comment-atom'
import { editedQuestionAtom } from '@/store/question-atom'

import { answerSchema, commentSchema, questionSchema } from './schemas'

export const ReactHookForm = () => {
  const editedQuestion = useAtomValue(editedQuestionAtom)
  const editedAnswer = useAtomValue(editedAnswerAtom)
  const editedContent = useAtomValue(editedCommentAtom)

  const onHandleQuestionForm = useForm<z.infer<typeof questionSchema>>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      title: editedQuestion.title,
      coding_problem: editedQuestion.coding_problem,
      tags: editedQuestion.tags,
      content: editedQuestion.content,
    },
  })

  const onHandleAnswerForm = useForm<z.infer<typeof answerSchema>>({
    resolver: zodResolver(answerSchema),
    defaultValues: {
      content: editedAnswer,
    },
  })

  const onHandleCommentForm = useForm<z.infer<typeof commentSchema>>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      content: editedContent,
    },
  })
  return { onHandleQuestionForm, onHandleAnswerForm, onHandleCommentForm }
}
