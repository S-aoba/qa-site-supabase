'use client'

import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useAtom } from 'jotai'
import type { UseFormReturn } from 'react-hook-form'

import { editedQuestionAtom } from '@/store/question-atom'

export const ContentEditor = ({
  handleForm,
}: {
  handleForm: UseFormReturn<
    {
      title: string
      coding_problem: string
      tags: string[]
      content: string
    },
    'content'
  >
}) => {
  const [editedQuestion, setEditedQuestion] = useAtom(editedQuestionAtom)

  const editor = useEditor({
    extensions: [StarterKit],
    content: editedQuestion.content,
    onUpdate({ editor }) {
      setEditedQuestion({ ...editedQuestion, content: editor.getHTML() })
      handleForm.setValue('content', editor.getHTML())
    },
  })

  return <EditorContent editor={editor} className=' min-h-[800px] rounded-lg border border-solid border-slate-300' />
}
