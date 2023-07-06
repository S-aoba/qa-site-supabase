'use client'

import { Button } from '@mantine/core'
import { RichTextEditor } from '@mantine/tiptap'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useAtom, useAtomValue } from 'jotai'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import Loading from '@/app/loading'
import type { QuestionType } from '@/common/types'
import type { Database } from '@/lib/database.types'
import { editedAnswerAtom } from '@/store/answer-atom'
import { profileAtom } from '@/store/profile-atom'

import { useContentEditor } from '../common/hooks/useContentEditor'

export const AnswerCreateForm = ({ userId, question }: { userId: string; question: QuestionType }) => {
  const user = useAtomValue(profileAtom)
  const { editor } = useContentEditor({ type: 'answer' })
  const [isLoading, setLoading] = useState(false)
  const supabase = createClientComponentClient<Database>()
  const pathname = usePathname()
  const [answerContent, setAnswerContent] = useAtom(editedAnswerAtom)
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleOnSubmit = async () => {
    setLoading(true)

    try {
      const { error: createAnswerError } = await supabase
        .from('answers')
        .insert({
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
      router.refresh()
    } catch (error) {
      setMessage('エラーが発生しました。' + error)
      return
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {userId ? (
        <form className='py-2' onSubmit={handleOnSubmit}>
          <RichTextEditor
            editor={editor}
            className=' min-h-[400px] w-full rounded-md border border-solid border-slate-300 shadow'
          >
            <RichTextEditor.Content />
          </RichTextEditor>
          <div className='flex w-full justify-end p-3'>
            {isLoading ? (
              <Loading />
            ) : (
              <Button type='submit' className='bg-slate-500 hover:transform-none hover:bg-slate-600'>
                回答を投稿
              </Button>
            )}
          </div>
        </form>
      ) : null}
      {message && <div className='my-5 text-center text-sm text-red-500'>{message}</div>}
    </>
  )
}
