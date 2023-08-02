'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { ReloadIcon } from '@radix-ui/react-icons'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useAtomValue, useSetAtom } from 'jotai'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import type * as z from 'zod'

import { answerSchema } from '@/common/schemas'
import type { Database } from '@/lib/database.types'
import { editedAnswerAtom, isAnswerEditModeAtom } from '@/store/answer-atom'

import { Button } from '../ui/button'
import { ContentEditor } from '../ui/content-editor'
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form'

export const AnswerUpdateForm = ({ answerId }: { answerId: string }) => {
  const editedAnswer = useAtomValue(editedAnswerAtom)
  const onHandleForm = useForm<z.infer<typeof answerSchema>>({
    resolver: zodResolver(answerSchema),
    defaultValues: {
      content: editedAnswer,
    },
  })
  const [isLoading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const router = useRouter()
  const pathname = usePathname()

  const supabase = createClientComponentClient<Database>()

  const setIsEditMode = useSetAtom(isAnswerEditModeAtom)
  const handleAnswerUpdate = async (values: z.infer<typeof answerSchema>) => {
    setLoading(true)
    const { content } = values

    try {
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
      router.push(`${pathname}`)
    } catch (error) {
      setMessage('エラーが発生しました。' + error)
      return
    } finally {
      setLoading(false)
      setIsEditMode(false)
    }
  }

  return (
    <>
      <Form {...onHandleForm}>
        <form onSubmit={onHandleForm.handleSubmit(handleAnswerUpdate)}>
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
    </>
  )
}
