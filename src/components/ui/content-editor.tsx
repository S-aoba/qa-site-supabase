'use client'

import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useState } from 'react'
import type { UseFormReturn } from 'react-hook-form'

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
  const [content, setContent] = useState('')

  const editor = useEditor({
    extensions: [StarterKit],
    content,
    onUpdate({ editor }) {
      setContent(editor.getHTML())
      handleForm.setValue('content', editor.getHTML())
    },
  })

  return <EditorContent editor={editor} className=' min-h-[800px] rounded-lg border border-solid border-slate-300' />
}
