'use client'

import { Button } from '@mantine/core'
import { RichTextEditor } from '@mantine/tiptap'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useAtom, useSetAtom } from 'jotai'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation'
import type { FormEvent } from 'react'
import { useState } from 'react'

import { useContentEditor } from '@/common/hooks/useContentEditor'
import type { Database } from '@/lib/database.types'
import { editedAnswerAtom, isAnswerEditModeAtom } from '@/store/answer-atom'

export const AnswerUpdateForm = ({ answerId }: { answerId: string }) => {
  const [isDisabled, setIsDisabled] = useState(true)

  const setIsEditMode = useSetAtom(isAnswerEditModeAtom)

  const { answerEditor } = useContentEditor(setIsDisabled)
  const [isLoading, setLoading] = useState(false)
  const supabase = createClientComponentClient<Database>()
  const pathname = usePathname()
  const [answerContent, setAnswerContent] = useAtom(editedAnswerAtom)
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleOnSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!answerEditor) return

    setLoading(true)

    try {
      const { error } = await supabase
        .from('answers')
        .update({
          content: answerContent,
        })
        .eq('id', answerId)
      if (error) {
        setMessage('予期せぬエラーが発生しました。' + error.message)
        return
      }
      router.push(`${pathname}`)
    } catch (error) {
      setMessage('エラーが発生しました。' + error)
      return
    } finally {
      setAnswerContent('')
      answerEditor.commands.setContent('')
      setLoading(false)
      setIsEditMode(false)
    }
  }

  return (
    <>
      <form className='py-2' onSubmit={handleOnSubmit}>
        <RichTextEditor
          editor={answerEditor}
          styles={{
            root: { border: '1px solid #cbd5e1', ':focus': { border: '1px solid #cbd5e1' } },
            content: {
              backgroundColor: '#f6f8fa',
              minHeight: '400px',
            },
          }}
        >
          <RichTextEditor.Content />
        </RichTextEditor>
        <div className='flex w-full justify-end p-3'>
          <Button
            type='submit'
            className='bg-slate-500 hover:transform-none hover:bg-slate-600'
            loading={isLoading}
            disabled={isDisabled}
          >
            {isLoading ? '回答を更新中' : '回答を更新'}
          </Button>
        </div>
      </form>
      {message && <div className='my-5 text-center text-sm text-red-500'>{message}</div>}
    </>
  )
}
