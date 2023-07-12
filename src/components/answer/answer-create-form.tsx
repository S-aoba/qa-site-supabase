'use client'

import { Button } from '@mantine/core'
import { RichTextEditor } from '@mantine/tiptap'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useAtom, useAtomValue } from 'jotai'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation'
import type { FormEvent } from 'react'
import { useState } from 'react'

import { useContentEditor } from '@/common/hooks/useContentEditor'
import type { ProfileType, QuestionType } from '@/common/types'
import type { Database } from '@/lib/database.types'
import { editedAnswerAtom } from '@/store/answer-atom'
import { profileAtom } from '@/store/profile-atom'

export const AnswerCreateForm = ({
  userId,
  question,
  profile,
}: {
  userId: string
  question: QuestionType
  profile: ProfileType | null
}) => {
  const user = useAtomValue(profileAtom)
  const [isLoading, setLoading] = useState(false)
  const [isDisabled, setIsDisabled] = useState(true)
  const { answerEditor } = useContentEditor(setIsDisabled)

  const supabase = createClientComponentClient<Database>()
  const pathname = usePathname()
  const [answerContent, setAnswerContent] = useAtom(editedAnswerAtom)
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleOnSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setLoading(true)

    try {
      const { data: answer, error: createAnswerError } = await supabase
        .from('answers')
        .upsert({
          user_id: userId,
          question_id: pathname.split('/')[3],
          content: answerContent,
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

      setAnswerContent('')
    } catch (error) {
      setMessage('エラーが発生しました。' + error)
      return
    } finally {
      setLoading(false)
      router.refresh()
    }
  }

  return (
    <div className='rounded-lg border border-solid border-slate-300'>
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
        <form onSubmit={handleOnSubmit}>
          <RichTextEditor
            editor={answerEditor}
            className=' min-h-[400px] w-full rounded-md border border-solid border-slate-300 shadow'
          >
            <RichTextEditor.Content />
          </RichTextEditor>
          <div className='flex w-full justify-end px-3 pt-3'>
            <Button
              type='submit'
              className='bg-slate-500 hover:transform-none hover:bg-slate-600'
              loading={isLoading}
              disabled={isDisabled}
            >
              {isLoading ? '回答を送信中' : '回答を送信'}
            </Button>
          </div>
        </form>
        {message && <div className='my-5 text-center text-sm text-red-500'>{message}</div>}
      </div>
    </div>
  )
}
