import { zodResolver } from '@hookform/resolvers/zod'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useAtom, useAtomValue } from 'jotai'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import type { z } from 'zod'

import { questionSchema } from '@/common/schemas'
import type { Database } from '@/lib/database.types'
import { profileAtom } from '@/store/profile-atom'
import { editedQuestionAtom } from '@/store/question-atom'

export const useQuestion = (userId: string) => {
  const [isLoading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const [editedQuestion, setEditedQuestion] = useAtom(editedQuestionAtom)
  const profile = useAtomValue(profileAtom)

  const supabase = createClientComponentClient<Database>()
  const router = useRouter()

  const onHandleQuestionForm = useForm<z.infer<typeof questionSchema>>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      title: editedQuestion.title,
      coding_problem: editedQuestion.coding_problem,
      tags: editedQuestion.tags,
      content: editedQuestion.content,
    },
  })

  const editor = useEditor({
    extensions: [StarterKit],
    content: editedQuestion.content,
    onUpdate({ editor }) {
      onHandleQuestionForm.setValue('content', editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm m-2 pb-2 pl-5 dark:prose-invert sm:prose-base focus:outline-none text-card-foreground',
      },
    },
  })

  const submit = async (values: z.infer<typeof questionSchema>) => {
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
        onHandleQuestionForm.reset({
          title: '',
          tags: [],
          coding_problem: '',
          content: '',
        })
      }
    }
  }

  return { isLoading, editor, message, onHandleQuestionForm, editedQuestion, submit }
}
