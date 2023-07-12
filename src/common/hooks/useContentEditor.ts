import { Link } from '@mantine/tiptap'
import Placeholder from '@tiptap/extension-placeholder'
import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import type { SetStateAction } from 'jotai'
import { useAtom } from 'jotai'
import type { Dispatch } from 'react'

import { editedAnswerAtom } from '@/store/answer-atom'
import { editedCommentAtom } from '@/store/comment-atom'
import { editedQuestionContentAtom } from '@/store/question-atom'

export const useContentEditor = (setIsDisabled?: Dispatch<SetStateAction<boolean>>) => {
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
      if (!setIsDisabled) return
      // ここでeditorの中身が空の時にdescriptionを空にする
      if (editor.getText() === '') {
        setAnswerContent('')
        setIsDisabled(true)
        return
      } else {
        setAnswerContent(editor.getHTML())
        setIsDisabled(false)
        return
      }
    },
  })

  const commentEditor = useEditor({
    extensions: [StarterKit, Link, Placeholder.configure({ placeholder: 'コメントを入力する' })],
    // 作成と更新時にescapeさせるかどうかは要検討。挙動を合わせるのが難しい
    content: comment,
    onUpdate({ editor }) {
      if (!setIsDisabled) return
      // ここでeditorの中身が空の時にdescriptionを空にする
      if (editor.getText() === '') {
        setComment('')
        setIsDisabled(true)
        return
      } else {
        setComment(editor.getHTML())
        setIsDisabled(false)
        return
      }
    },
  })

  return { questionEditor, answerEditor, commentEditor }
}
