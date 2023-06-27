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

// const escapeHtml = (unsafe: string) => {
//   return unsafe
//     .replace(/&/g, '&amp;')
//     .replace(/</g, '&lt;')
//     .replace(/>/g, '&gt;')
//     .replace(/"/g, '&quot;')
//     .replace(/'/g, '&#039;')
// }

export const useDescriptionEditor = ({ type }: { type: 'question' | 'answer' }) => {
  const [editedQuestionDescription, setEditedQuestionDescription] = useAtom(editedQuestionDescriptionAtom)
  const [answerDescription, setAnswerDescription] = useAtom(editedAnswerAtom)

  const editor = useEditor({
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
    // 作成と更新時にescapeさせるかどうかは要検討。挙動を合わせるのが難しい
    content: type === 'question' ? editedQuestionDescription : answerDescription,
    onUpdate({ editor }) {
      // ここでeditorの中身が空の時にdescriptionを空にする
      if (editor.getText() === '') {
        if (type === 'question') {
          setEditedQuestionDescription('')
          return
        }
        setAnswerDescription('')
      } else {
        if (type === 'question') {
          setEditedQuestionDescription(editor.getHTML())
          return
        }
        setAnswerDescription(editor.getHTML())
      }
    },
  })

  return { editor }
}
