'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { ReloadIcon } from '@radix-ui/react-icons'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useAtom, useAtomValue } from 'jotai'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import type { Database } from '@/lib/database.types'
import { profileAtom } from '@/store/profile-atom'
import { editedQuestionAtom, editedQuestionContentAtom } from '@/store/question-atom'

import { useContentEditor } from '../../common/hooks/useContentEditor'
import { Button } from '../ui/button'
import { ContentEditor } from '../ui/content-editor'
import { Input } from '../ui/input'
import { MultiSelect } from '../ui/multi-select'
import { Select } from '../ui/select'

const schema = z.object({
  title: z
    .string()
    .min(1, { message: '質問タイトルを1文字以上入力してください' })
    .max(100, { message: '100文字以上入力できません' }),
  coding_problem: z.string().min(1, { message: '問題を1つ選択してください' }),
  tags: z.string().array().min(1, { message: 'タグを1つ以上選択してください' }),
  content: z.string().min(1, { message: '1文字以上入力してください' }),
})

export const QuestionEdit = () => {
  const editedQuestion = useAtomValue(editedQuestionAtom)
  const [editedQuestionContent, setEditedQuestionContent] = useAtom(editedQuestionContentAtom)
  const profile = useAtomValue(profileAtom)

  const { questionEditor } = useContentEditor()
  const supabase = createClientComponentClient<Database>()
  const [isLoading, setLoading] = useState(false)
  const [_, setMessage] = useState('')

  const router = useRouter()

  const onHandleForm = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: editedQuestion.title,
      coding_problem: editedQuestion.coding_problem,
      tags: editedQuestion.tags,
      content: editedQuestionContent,
    },
  })

  const handleOnSubmit = async (values: z.infer<typeof schema>) => {
    if (!questionEditor) return

    setLoading(true)
    const { title, coding_problem, tags, content } = values

    try {
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
      setEditedQuestionContent('')
      questionEditor.commands.setContent('')
      router.push(`/${profile.username}/questions/${editedQuestion.id}`)
    } catch (error) {
      setMessage('エラーが発生しました。' + error)
      return
    } finally {
      setLoading(false)
      router.refresh()
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
          render={() => {
            return (
              <FormItem>
                <FormControl>
                  <ContentEditor handleForm={onHandleForm} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )
          }}
        />
        <div className='flex w-full justify-end px-3'>
          <Button type='submit' variant='default' disabled={isLoading}>
            {isLoading && <ReloadIcon className='mr-2 h-4 w-4 animate-spin' />}
            {isLoading ? '質問を更新中' : '質問を更新'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
