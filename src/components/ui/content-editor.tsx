'use client'

import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

export const ContentEditor = ({
  handleOnChange,
  content,
}: {
  handleOnChange: (...event: string[]) => void
  content: string
}) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    onUpdate({ editor }) {
      handleOnChange(editor.getHTML())
    },
  })

  return <EditorContent editor={editor} className=' min-h-[800px] rounded-lg border border-solid border-slate-300' />
}
