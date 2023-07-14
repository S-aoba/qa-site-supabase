'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useAtom, useSetAtom } from 'jotai'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation'
import type { FormEvent } from 'react'
import { useState } from 'react'

import { useContentEditor } from '@/common/hooks/useContentEditor'
import type { Database } from '@/lib/database.types'
import { editedAnswerAtom, isAnswerEditModeAtom } from '@/store/answer-atom'

export const useUpdateAnswer = (answerId: string) => {
  const [isDisabled, setIsDisabled] = useState(true)
  const [isLoading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const router = useRouter()
  const pathname = usePathname()

  const supabase = createClientComponentClient<Database>()

  const { answerEditor } = useContentEditor(setIsDisabled)

  const setIsEditMode = useSetAtom(isAnswerEditModeAtom)
  const [answerContent, setAnswerContent] = useAtom(editedAnswerAtom)

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

  return { handleOnSubmit, isLoading, isDisabled, message, answerEditor }
}
