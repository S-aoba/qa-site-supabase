'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { ReloadIcon } from '@radix-ui/react-icons'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useAtomValue } from 'jotai'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import type { ProfileType, QuestionType } from '@/common/types'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import type { Database } from '@/lib/database.types'
import { editedAnswerAtom } from '@/store/answer-atom'
import { profileAtom } from '@/store/profile-atom'

import { Button } from '../ui/button'
import { ContentEditor } from '../ui/content-editor'

const schema = z.object({
  content: z.string().min(1, { message: '1文字以上入力してください' }),
})
export const AnswerCreateForm = ({
  userId,
  question,
  profile,
}: {
  userId: string
  question: QuestionType
  profile: ProfileType | null
}) => {
  // const { handleOnSubmit, isLoading, message, answerEditor } = useCreateAnswer({ question, userId })
  const [isLoading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  const supabase = createClientComponentClient<Database>()

  const user = useAtomValue(profileAtom)
  const editedAnswer = useAtomValue(editedAnswerAtom)
  const onHandleForm = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      content: editedAnswer,
    },
  })

  const handleCreateAnswer = async (values: z.infer<typeof schema>) => {
    setLoading(true)
    const { content } = values
    try {
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
    } catch (error) {
      setMessage('エラーが発生しました。' + error)
      return
    } finally {
      // answerEditor.commands.setContent('')
      setLoading(false)
      router.refresh()
    }
  }
  return (
    <div className='min-h-full rounded-lg border border-solid border-slate-300'>
      <div className='flex items-center space-x-2 rounded-t-lg border-b border-l-0 border-r-0 border-t-0 border-solid border-slate-300 bg-[#f6f8fa] p-2'>
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
        <span className='text-xl font-semibold text-slate-600'>回答する</span>
      </div>
      <div className='px-2 py-5'>
        <Form {...onHandleForm}>
          <form onSubmit={onHandleForm.handleSubmit(handleCreateAnswer)}>
            <FormField
              control={onHandleForm.control}
              name='content'
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormControl>
                      <ContentEditor handleOnChange={field.onChange} content={editedAnswer} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )
              }}
            />
            <div className='flex w-full justify-end px-3 pt-3'>
              <Button type='submit' variant='default' disabled={isLoading}>
                {isLoading && <ReloadIcon className='mr-2 h-4 w-4 animate-spin' />}
                {isLoading ? '回答を送信中' : '回答を送信'}
              </Button>
            </div>
          </form>
          {message && <div className='my-5 text-center text-sm text-red-500'>{message}</div>}
        </Form>
      </div>
    </div>
  )
}
