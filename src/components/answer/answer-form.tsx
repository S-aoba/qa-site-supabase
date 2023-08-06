'use client'

import { ReloadIcon } from '@radix-ui/react-icons'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { z } from 'zod'

import { FormAlert } from '@/common/form-alert'
import { ReactHookForm } from '@/common/react-hook-form'
import type { answerSchema } from '@/common/schemas'
import type { ProfileType, QuestionType } from '@/common/types'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import type { Database } from '@/lib/database.types'
import { editedAnswerAtom, isAnswerEditModeAtom } from '@/store/answer-atom'
import { profileAtom } from '@/store/profile-atom'

import { Button } from '../ui/button'
import { ContentEditor } from '../ui/content-editor'

export const AnswerForm = ({
  userId,
  question,
  profile,
  answerId,
}: {
  userId?: string
  question?: QuestionType
  profile?: ProfileType | null
  answerId?: string
}) => {
  FormAlert()
  const [isLoading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

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
  })

  const handleOnSubmit = async (values: z.infer<typeof answerSchema>) => {
    setLoading(true)
    const { content } = values

    try {
      if (answerId === undefined && userId && question) {
        const { data: answer, error: createAnswerError } = await supabase
          .from('answers')
          .upsert({
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

  return (
    <div className={`${answerId === undefined && 'min-h-full rounded-lg border'}`}>
      {answerId === undefined && (
        <div className='flex items-center space-x-2 rounded-t-lg border-b p-2'>
          <div className='relative h-10 w-10'>
            <Image
              src={profile && profile.avatar_url ? profile.avatar_url : '/default.png'}
              className='rounded-full object-cover'
              alt='avatar'
              fill
              sizes='auto'
              priority
            />
          </div>
          <span className='text-xl'>回答する</span>
        </div>
      )}
      <div className='px-2 py-5'>
        <Form {...onHandleAnswerForm}>
          <form onSubmit={onHandleAnswerForm.handleSubmit(handleOnSubmit)}>
            <FormField
              control={onHandleAnswerForm.control}
              name='content'
              render={() => {
                return (
                  <FormItem>
                    <FormControl>
                      <ContentEditor editor={editor} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )
              }}
            />
            <div className='flex w-full justify-end px-3 pt-3'>
              {answerId === undefined ? (
                <Button type='submit' variant='default' disabled={isLoading}>
                  {isLoading && <ReloadIcon className='mr-2 h-4 w-4 animate-spin' />}
                  {isLoading ? '回答を送信中' : '回答を送信'}
                </Button>
              ) : (
                <Button type='submit' variant='default' disabled={isLoading}>
                  {isLoading && <ReloadIcon className='mr-2 h-4 w-4 animate-spin' />}
                  {isLoading ? '回答を更新中' : '回答を更新'}
                </Button>
              )}
            </div>
          </form>
          {message && <div className='my-5 text-center text-sm text-red-500'>{message}</div>}
        </Form>
      </div>
    </div>
  )
}
