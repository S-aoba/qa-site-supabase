'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { ReloadIcon } from '@radix-ui/react-icons'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useAtomValue } from 'jotai'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import type * as z from 'zod'

import { questionSchema } from '@/common/schemas'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import type { Database } from '@/lib/database.types'
import { profileAtom } from '@/store/profile-atom'
import { editedQuestionAtom } from '@/store/question-atom'

import { useContentEditor } from '../../common/hooks/useContentEditor'
import { Button } from '../ui/button'
import { ContentEditor } from '../ui/content-editor'
import { Input } from '../ui/input'
import { MultiSelect } from '../ui/multi-select'
import { Select } from '../ui/select'

export const QuestionPost = ({ userId }: { userId: string }) => {
  const editedQuestion = useAtomValue(editedQuestionAtom)
  const profile = useAtomValue(profileAtom)

  const { questionEditor } = useContentEditor()
  const supabase = createClientComponentClient<Database>()
  const [isLoading, setLoading] = useState(false)

  const [_, setMessage] = useState('')

  const router = useRouter()

  const onHandleForm = useForm<z.infer<typeof questionSchema>>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      title: editedQuestion.title,
      coding_problem: editedQuestion.coding_problem,
      tags: editedQuestion.tags,
      content: editedQuestion.content,
    },
  })

  const handleOnSubmit = async (values: z.infer<typeof questionSchema>) => {
    if (!questionEditor) return
    setLoading(true)

    const { title, coding_problem, tags, content } = values

    try {
      const { data: question, error: createQuestionError } = await supabase
        .from('questions')
        .upsert({
          title,
          content,
          tags,
          coding_problem,
          user_id: userId,
        })
        .select('*')
        .single()

      if (createQuestionError) {
        setMessage('予期せぬエラーが発生しました。' + createQuestionError.message)
        return
      }

      const { error: createQuestionWaitingAnswers } = await supabase.from('question_waiting_answers').insert({
        question_id: question.id,
      })

      if (createQuestionWaitingAnswers) {
        setMessage('予期せぬエラーが発生しました。' + createQuestionWaitingAnswers.message)
        return
      }

      questionEditor.commands.setContent('')
      router.push(`/${profile.username}/questions/${question.id}`)
    } catch (error) {
      setMessage('エラーが発生しました。' + error)
      return
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...onHandleForm}>
      <form className=' flex flex-col justify-center gap-y-7' onSubmit={onHandleForm.handleSubmit(handleOnSubmit)}>
        <FormField
          control={onHandleForm.control}
          name='title'
          render={({ field }) => {
            return (
              <FormItem>
                <FormControl>
                  <Input placeholder='タイトル' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )
          }}
        />
        <FormField
          control={onHandleForm.control}
          name='coding_problem'
          render={() => {
            return (
              <FormItem>
                <FormControl>
                  <Select handleForm={onHandleForm} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )
          }}
        />
        <FormField
          control={onHandleForm.control}
          name='tags'
          render={() => {
            return (
              <FormItem>
                <FormControl>
                  <MultiSelect handleForm={onHandleForm} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )
          }}
        />
        <FormField
          control={onHandleForm.control}
          name='content'
          render={({ field }) => {
            return (
              <FormItem>
                <FormControl>
                  <ContentEditor handleOnChange={field.onChange} content={editedQuestion.content} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )
          }}
        />
        <div className='flex w-full justify-end px-3'>
          <Button type='submit' variant='default' disabled={isLoading}>
            {isLoading && <ReloadIcon className='mr-2 h-4 w-4 animate-spin' />}
            {isLoading ? '質問を送信中' : '質問を送信'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
