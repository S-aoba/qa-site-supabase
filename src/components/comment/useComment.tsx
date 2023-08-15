import { zodResolver } from '@hookform/resolvers/zod'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { type z } from 'zod'

import { commentSchema } from '@/common/schemas'
import type { AnswerType } from '@/common/types'
import type { Database } from '@/lib/database.types'
import { editedCommentAtom, isCommentEditModeAtom, isDisplayCommentsAtom } from '@/store/comment-atom'
import { profileAtom } from '@/store/profile-atom'

export const useComment = (answer?: AnswerType, commentId?: string) => {
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState('/default.png')

  const router = useRouter()

  const supabase = createClientComponentClient<Database>()

  const setIsEditMode = useSetAtom(isCommentEditModeAtom)
  const [editedCommentContent, setEditedCommentContent] = useAtom(editedCommentAtom)
  const user = useAtomValue(profileAtom)
  const setIsDisplayComments = useSetAtom(isDisplayCommentsAtom)

  const onHandleCommentForm = useForm<z.infer<typeof commentSchema>>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      content: editedCommentContent,
    },
  })

  const editor = useEditor({
    extensions: [StarterKit],
    content: editedCommentContent,
    onUpdate({ editor }) {
      onHandleCommentForm.setValue('content', editor.getHTML())
      setEditedCommentContent(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class:
          'prose prose-sm m-2 pb-2 pl-5 dark:prose-invert sm:prose-base focus:outline-none text-primary dark:brightness-75',
      },
    },
  })

  // アバター画像の取得
  useEffect(() => {
    if (user && user.avatar_url) {
      setAvatarUrl(user.avatar_url)
    }
  }, [user])

  const handleOnSubmit = async (values: z.infer<typeof commentSchema>) => {
    setIsLoading(true)
    const { content } = values

    try {
      if (commentId === undefined && answer && user.username) {
        const { error: createCommentError } = await supabase
          .from('comments')
          .insert({
            user_id: user.id,
            answer_id: answer.id,
            username: user.username,
            avatar_url: user.avatar_url,
            content,
          })
          .select('*')
          .single()
        if (createCommentError) {
          setMessage('予期せぬエラーが発生しました。' + createCommentError.message)
          return
        }
      } else {
        const { error: updateCommentError } = await supabase
          .from('comments')
          .update({
            content,
          })
          .eq('id', commentId)
        if (updateCommentError) {
          setMessage('予期せぬエラーが発生しました。' + updateCommentError.message)
          return
        }
      }
    } catch (error) {
      setMessage('エラーが発生しました。' + error)
      return
    } finally {
      if (editor) {
        editor.commands.clearContent()
        setEditedCommentContent('')
        onHandleCommentForm.reset({ content: '' })
      }
      setIsLoading(false)
      setIsEditMode(false)
      router.refresh()
      setIsDisplayComments(true)
    }
  }

  return { message, isLoading, avatarUrl, onHandleCommentForm, editor, handleOnSubmit }
}
