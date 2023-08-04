'use client'

import { ReloadIcon } from '@radix-ui/react-icons'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useAtom, useAtomValue } from 'jotai'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { z } from 'zod'

import { ReactHookForm } from '@/common/react-hook-form'
import type { questionSchema } from '@/common/schemas'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import type { Database } from '@/lib/database.types'
import { profileAtom } from '@/store/profile-atom'
import { editedQuestionAtom } from '@/store/question-atom'

import { Button } from '../ui/button'
import { ContentEditor } from '../ui/content-editor'
import { Input } from '../ui/input'
import { MultiSelect } from '../ui/multi-select'
import { Select } from '../ui/select'

export const QuestionForm = ({ userId }: { userId: string }) => {
  const [isLoading, setLoading] = useState(false)

  const [_, setMessage] = useState('')
  const router = useRouter()

  const supabase = createClientComponentClient<Database>()

  const [editedQuestion, setEditedQuestion] = useAtom(editedQuestionAtom)
  const profile = useAtomValue(profileAtom)
  const { onHandleQuestionForm } = ReactHookForm()

  const editor = useEditor({
    extensions: [StarterKit],
    content: editedQuestion.content,
    onUpdate({ editor }) {
      onHandleQuestionForm.setValue('content', editor.getHTML())
    },
  })

  const handleOnSubmit = async (values: z.infer<typeof questionSchema>) => {
    setLoading(true)

    const { title, coding_problem, tags, content } = values

    try {
      if (editedQuestion.id === '') {
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
        router.push(`/${profile.username}/questions/${question.id}`)
      } else if (editedQuestion.id !== '') {
        const { error: updateQuestionError } = await supabase
          .from('questions')
          .update({
            title,
            content,
            tags,
            coding_problem,
          })
          .eq('id', editedQuestion.id)

        if (updateQuestionError) {
          setMessage('予期せぬエラーが発生しました。' + updateQuestionError.message)
          return
        }
        router.push(`/${profile.username}/questions/${editedQuestion.id}`)
      }
    } catch (error) {
      setMessage('エラーが発生しました。' + error)
      return
    } finally {
      setLoading(false)
      router.refresh()
      if (editor) {
        editor.commands.setContent('')
        setEditedQuestion({
          id: '',
          title: '',
          tags: [],
          coding_problem: '',
          content: '',
        })
        onHandleQuestionForm.reset()
      }
    }
  }

  return (
    <Form {...onHandleQuestionForm}>
      <form
        className=' flex flex-col justify-center gap-y-7'
        onSubmit={onHandleQuestionForm.handleSubmit(handleOnSubmit)}
      >
        <FormField
          control={onHandleQuestionForm.control}
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
          control={onHandleQuestionForm.control}
          name='coding_problem'
          render={() => {
            return (
              <FormItem>
                <FormControl>
                  <Select handleForm={onHandleQuestionForm} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )
          }}
        />
        <FormField
          control={onHandleQuestionForm.control}
          name='tags'
          render={() => {
            return (
              <FormItem>
                <FormControl>
                  <MultiSelect handleForm={onHandleQuestionForm} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )
          }}
        />
        <FormField
          control={onHandleQuestionForm.control}
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
        <div className='flex w-full justify-end px-3'>
          {editedQuestion.id === '' ? (
            <Button type='submit' variant='default' disabled={isLoading}>
              {isLoading && <ReloadIcon className='mr-2 h-4 w-4 animate-spin' />}
              {isLoading ? '質問を送信中' : '質問を送信'}
            </Button>
          ) : (
            <Button type='submit' variant='default' disabled={isLoading}>
              {isLoading && <ReloadIcon className='mr-2 h-4 w-4 animate-spin' />}
              {isLoading ? '質問を更新中' : '質問を更新'}
            </Button>
          )}
        </div>
      </form>
    </Form>
  )
}
