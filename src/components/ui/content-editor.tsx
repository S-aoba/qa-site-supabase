'use client'

import type { Editor } from '@tiptap/react'
import { EditorContent } from '@tiptap/react'

export const ContentEditor = ({ editor }: { editor: Editor | null }) => {
  return <EditorContent editor={editor} className='min-h-[200px] rounded-lg border bg-white p-2' />
}
