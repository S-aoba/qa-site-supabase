// import { Highlight } from '@mantine/core'
import { Link } from '@mantine/tiptap'
import Placeholder from '@tiptap/extension-placeholder'
// import Highlight from '@tiptap/extension-highlight'
// import SubScript from '@tiptap/extension-subscript'
// import Superscript from '@tiptap/extension-superscript'
// import TextAlign from '@tiptap/extension-text-align'
// import Underline from '@tiptap/extension-underline'
import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useAtom } from 'jotai'

import { editedAnswerAtom } from '@/store/answer-atom'
import { editedQuestionDescriptionAtom } from '@/store/question-atom'

const escapeHtml = (unsafe: string) => {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

export const useDescriptionEditor = () => {
  const [editedQuestionDescription, setEditedQuestionDescription] = useAtom(editedQuestionDescriptionAtom)
  const [answerDescription, setAnswerDescription] = useAtom(editedAnswerAtom)

  const questionEditor = useEditor({
    extensions: [
      StarterKit,
      Link,
      Placeholder.configure({ placeholder: '質問を入力する' }),
      // Underline,
      // Superscript,
      // SubScript,
      // Highlight,
      // TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: escapeHtml(editedQuestionDescription),
    onUpdate({ editor }) {
      // ここでeditorの中身が空の時にdescriptionを空にする
      if (editor.getText() === '') {
        setEditedQuestionDescription('')
      } else {
        setEditedQuestionDescription(editor.getHTML())
      }
    },
  })

  const answerEditor = useEditor({
    extensions: [
      StarterKit,
      Link,
      Placeholder.configure({ placeholder: '回答を入力する' }),
      // Highlight,
      // Underline,
      // Superscript,
      // SubScript,
      // TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: escapeHtml(answerDescription),
    onUpdate({ editor }) {
      // ここでeditorの中身が空の時にdescriptionを空にする
      if (editor.getText() === '') {
        setAnswerDescription('')
      } else {
        setAnswerDescription(editor.getHTML())
      }
    },
  })
  return { questionEditor, answerEditor }
}
