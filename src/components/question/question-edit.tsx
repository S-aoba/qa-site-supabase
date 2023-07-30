'use client'

import { MultiSelect } from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import { RichTextEditor } from '@mantine/tiptap'
import { ReloadIcon } from '@radix-ui/react-icons'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useAtom, useAtomValue } from 'jotai'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import * as z from 'zod'

import type { Database } from '@/lib/database.types'
import { profileAtom } from '@/store/profile-atom'
import { editedQuestionAtom, editedQuestionContentAtom } from '@/store/question-atom'

import { useContentEditor } from '../../common/hooks/useContentEditor'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Select } from '../ui/select'

const schema = z.object({
  title: z
    .string()
    .min(1, { message: '質問タイトルを1文字以上入力してください' })
    .max(100, { message: 'これ以上入力できません' }),
  coding_problem: z.string().min(1, { message: '問題を1つ選択してください' }),
  tags: z.string().array().min(1, { message: 'タグを1つ以上選択してください' }),
})

export const QuestionEdit = () => {
  const editedQuestion = useAtomValue(editedQuestionAtom)
  const [editedQuestionContent, setEditedQuestionContent] = useAtom(editedQuestionContentAtom)
  const profile = useAtomValue(profileAtom)

  const { questionEditor } = useContentEditor()
  const supabase = createClientComponentClient<Database>()
  const [isLoading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const router = useRouter()

  const handleForm = useForm({
    validate: zodResolver(schema),
    initialValues: {
      title: editedQuestion.title,
      coding_problem: editedQuestion.coding_problem,
      tags: editedQuestion.tags,
    },
  })

  const handleOnSubmit = async (props: { title: string; coding_problem: string; tags: string[] }) => {
    if (!questionEditor) return

    setLoading(true)
    const { title, coding_problem, tags } = props

    try {
      const { error } = await supabase
        .from('questions')
        .update({
          title: title,
          content: editedQuestionContent,
          tags: tags,
          coding_problem: coding_problem,
        })
        .eq('id', editedQuestion.id)

      if (error) {
        setMessage('予期せぬエラーが発生しました。' + error.message)
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
    <>
      <form className=' flex flex-col justify-center gap-y-7' onSubmit={handleForm.onSubmit(handleOnSubmit)}>
        <Input id='title' type='text' placeholder='質問タイトル' {...handleForm.getInputProps('title')} />
        <Select />
        <MultiSelect
          {...handleForm.getInputProps('tags')}
          data={data}
          placeholder='タグを最大5つまで選択できます'
          searchable
          nothingFound='Nothing found'
          clearable
          withAsterisk
          maxSelectedValues={5}
          styles={{ input: { border: '1px solid #cbd5e1', ':focus-within': { border: '1px solid #cbd5e1' } } }}
        />

        <RichTextEditor
          editor={questionEditor}
          className=' min-h-[400px] w-full rounded-md border border-solid border-slate-300 shadow'
        >
          <RichTextEditor.Content />
        </RichTextEditor>
        <div className='flex w-full justify-end px-3'>
          <Button type='submit' variant='default' disabled={isLoading}>
            {isLoading && <ReloadIcon className='mr-2 h-4 w-4 animate-spin' />}
            {isLoading ? '質問を更新中' : '質問を更新'}
          </Button>
        </div>
      </form>
      {message && <div className='my-5 text-center text-sm text-red-500'>{message}</div>}
    </>
  )
}
const data = [
  { value: 'c', label: 'C' },
  { value: 'c++', label: 'C++' },
  { value: 'csharp', label: 'C#' },
  { value: 'java', label: 'Java' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'php', label: 'PHP' },
  { value: 'python', label: 'Python' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'swift', label: 'Swift' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'go', label: 'Go' },
  { value: 'kotlin', label: 'Kotlin' },
  { value: 'rust', label: 'Rust' },
  { value: 'react', label: 'React' },
  { value: 'next.js', label: 'Next.js' },
]
