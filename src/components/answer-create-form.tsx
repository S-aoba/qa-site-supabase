import { Button } from '@mantine/core'
import { RichTextEditor } from '@mantine/tiptap'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useAtom } from 'jotai'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import Loading from '@/app/loading'
import type { Database } from '@/lib/database.types'
import { editedAnswerAtom } from '@/store/answer-atom'

import { useContentEditor } from '../common/hooks/useContentEditor'

export const AnswerCreateForm = ({ userId }: { userId: string }) => {
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
      const { error: createAnswerError } = await supabase.from('answers').insert({
        user_id: userId,
        question_id: pathname.split('/')[3],
        content: answerContent,
      })

      const { error: updateQuestionError } = await supabase
        .from('questions')
        .update({
          is_answered: true,
        })
        .eq('id', pathname.split('/')[3])

      if (createAnswerError) {
        setMessage('予期せぬエラーが発生しました。' + createAnswerError.message)
        return
      } else if (updateQuestionError) {
        setMessage('予期せぬエラーが発生しました。' + updateQuestionError.message)
        return
      }
      setAnswerContent('')
      router.push(`${pathname}`)
    } catch (error) {
      setMessage('エラーが発生しました。' + error)
      return
    } finally {
      setLoading(false)
      router.refresh()
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
