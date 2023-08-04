import { zodResolver } from '@hookform/resolvers/zod'
import { useAtomValue } from 'jotai'
import { useForm } from 'react-hook-form'
import type * as z from 'zod'

import { editedAnswerAtom } from '@/store/answer-atom'
import { editedCommentAtom } from '@/store/comment-atom'
import { profileAtom } from '@/store/profile-atom'
import { editedQuestionAtom } from '@/store/question-atom'

import {
  answerSchema,
  commentSchema,
  emailSchema,
  loginSchema,
  passwordSchema,
  profileSchema,
  questionSchema,
  signupSchema,
} from './schemas'

export const ReactHookForm = () => {
  const editedQuestion = useAtomValue(editedQuestionAtom)
  const editedAnswer = useAtomValue(editedAnswerAtom)
  const editedContent = useAtomValue(editedCommentAtom)
  const user = useAtomValue(profileAtom)

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

  const onHandleProfileForm = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.username ? user.username : '',
      introduce: user.introduce ? user.introduce : '',
      twitter_url: user.twitter_url ? user.twitter_url : '',
      github_url: user.github_url ? user.github_url : '',
      website_url: user.website_url ? user.website_url : '',
    },
  })

  const onHandlePasswordForm = useForm({
    // 初期値
    defaultValues: { password: '', confirmation: '' },
    // 入力値の検証
    resolver: zodResolver(passwordSchema),
  })

  const onHandleEmailForm = useForm({
    defaultValues: { email: '' },
    resolver: zodResolver(emailSchema),
  })

  const onHandleSignupForm = useForm({
    // 初期値
    defaultValues: { username: '', email: '', password: '' },
    // 入力値の検証
    resolver: zodResolver(signupSchema),
  })

  const onHandleResetPasswordForm = useForm({
    // 初期値
    defaultValues: { email: '' },
    // 入力値の検証
    resolver: zodResolver(emailSchema),
  })

  const onHandleResetPasswordConfirmForm = useForm({
    // 初期値
    defaultValues: { password: '', confirmation: '' },
    // 入力値の検証
    resolver: zodResolver(passwordSchema),
  })

  const onHandleLoginForm = useForm({
    // 初期値
    defaultValues: { email: '', password: '' },
    // 入力値の検証
    resolver: zodResolver(loginSchema),
  })
  return {
    onHandleQuestionForm,
    onHandleAnswerForm,
    onHandleCommentForm,
    onHandleProfileForm,
    onHandlePasswordForm,
    onHandleEmailForm,
    onHandleSignupForm,
    onHandleResetPasswordForm,
    onHandleResetPasswordConfirmForm,
    onHandleLoginForm,
  }
}