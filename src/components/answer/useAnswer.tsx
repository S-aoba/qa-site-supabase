import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import type { z } from 'zod'

import { ReactHookForm } from '@/common/react-hook-form'
import type { answerSchema } from '@/common/schemas'
import type { QuestionType } from '@/common/types'
import type { Database } from '@/lib/database.types'
import { editedAnswerAtom, isAnswerEditModeAtom } from '@/store/answer-atom'
import { profileAtom } from '@/store/profile-atom'

export const useAnswer = (userId?: string, question?: QuestionType, answerId?: string) => {
  const [isLoading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('/default.png')

  const router = useRouter()

  const supabase = createClientComponentClient<Database>()

  const [editedAnswerContent, setEditedAnswerContent] = useAtom(editedAnswerAtom)
  const setIsEditMode = useSetAtom(isAnswerEditModeAtom)
  const user = useAtomValue(profileAtom)

  const { onHandleAnswerForm } = ReactHookForm()

  const editor = useEditor({
    extensions: [StarterKit],
    content: editedAnswerContent,
    onUpdate({ editor }) {
      onHandleAnswerForm.setValue('content', editor.getHTML())
      setEditedAnswerContent(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class:
          'prose prose-sm m-2 pb-2 pl-5 dark:prose-invert sm:prose-base focus:outline-none text-primary dark:brightness-75',
      },
    },
  })

  // アバター画像の取得
  useEffect(() => {
    if (user && user.avatar_url) {
      setAvatarUrl(user.avatar_url)
    }
  }, [user])

  const handleOnSubmit = async (values: z.infer<typeof answerSchema>) => {
    setLoading(true)
    const { content } = values

    try {
      if (answerId === undefined && userId && question && user.username) {
        const { data: answer, error: createAnswerError } = await supabase
          .from('answers')
          .upsert({
            username: user.username,
            avatar_url: user.avatar_url,
            user_id: userId,
            question_id: question.id,
            content,
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
      } else {
        const { error } = await supabase
          .from('answers')
          .update({
            content,
          })
          .eq('id', answerId)
        if (error) {
          setMessage('予期せぬエラーが発生しました。' + error.message)
          return
        }
        setIsEditMode(false)
      }
    } catch (error) {
      setMessage('エラーが発生しました。' + error)
      return
    } finally {
      if (editor) {
        editor.commands.clearContent()
        setEditedAnswerContent('')
        onHandleAnswerForm.reset()
      }
      setLoading(false)
      router.refresh()
    }
  }

  return { isLoading, message, avatarUrl, onHandleAnswerForm, editor, handleOnSubmit }
}
