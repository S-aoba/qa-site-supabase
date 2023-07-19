import { Link } from '@mantine/tiptap'
import Placeholder from '@tiptap/extension-placeholder'
import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useAtom } from 'jotai'

import { editedAnswerAtom } from '@/store/answer-atom'
import { editedCommentAtom } from '@/store/comment-atom'
import { editedQuestionContentAtom } from '@/store/question-atom'

export const useContentEditor = () => {
  const [editedQuestionDescription, setEditedQuestionDescription] = useAtom(editedQuestionContentAtom)
  const [answerContent, setAnswerContent] = useAtom(editedAnswerAtom)
  const [comment, setComment] = useAtom(editedCommentAtom)

  const questionEditor = useEditor({
    extensions: [StarterKit, Link, Placeholder.configure({ placeholder: '質問を入力する' })],
    // 作成と更新時にescapeさせるかどうかは要検討。挙動を合わせるのが難しい
    content: editedQuestionDescription,
    onUpdate({ editor }) {
      // ここでeditorの中身が空の時にdescriptionを空にする
      if (editor.getText() === '') {
        setEditedQuestionDescription('')
        return
      } else {
        setEditedQuestionDescription(editor.getHTML())
        return
      }
    },
  })

  const answerEditor = useEditor({
    extensions: [StarterKit, Link, Placeholder.configure({ placeholder: '回答を入力する' })],
    // 作成と更新時にescapeさせるかどうかは要検討。挙動を合わせるのが難しい
    content: answerContent,
    onUpdate({ editor }) {
      // ここでeditorの中身が空の時にdescriptionを空にする
      if (editor.getText() === '') {
        setAnswerContent('')
        return
      } else {
        setAnswerContent(editor.getHTML())
        return
      }
    },
  })

  const commentEditor = useEditor({
    extensions: [StarterKit, Link, Placeholder.configure({ placeholder: 'コメントを入力する' })],
    // 作成と更新時にescapeさせるかどうかは要検討。挙動を合わせるのが難しい
    content: comment,
    onUpdate({ editor }) {
      // ここでeditorの中身が空の時にdescriptionを空にする
      if (editor.getText() === '') {
        setComment('')
        return
      } else {
        setComment(editor.getHTML())
        return
      }
    },
  })

  return { questionEditor, answerEditor, commentEditor }
}
