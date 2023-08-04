'use client'

import { EditorContent } from '@tiptap/react'

import { useContentEditor } from '@/common/hooks/useContentEditor'

export const ContentEditor = ({
  handleOnChange,
  content,
}: {
  handleOnChange: (...event: string[]) => void
  content: string
}) => {
  const { editor } = useContentEditor({ handleOnChange, content })

  return <EditorContent editor={editor} className=' min-h-[800px] rounded-lg border border-solid border-slate-300' />
}
