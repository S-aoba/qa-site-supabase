import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { IconEdit, IconTrash } from '@tabler/icons-react'
import type { SetStateAction } from 'jotai'
import { useSetAtom } from 'jotai'
import { useRouter } from 'next/navigation'
import type { Dispatch } from 'react'

import type { CommentType } from '@/common/types'
import type { Database } from '@/lib/database.types'
import { editedCommentAtom } from '@/store/comment-atom'

export const CommentActions = ({
  userId,
  comment,
  isEditMode,
  setIsEditMode,
  setMessage,
}: {
  userId: string | undefined
  comment: CommentType
  isEditMode: boolean
  setIsEditMode: Dispatch<SetStateAction<boolean>>
  setMessage: Dispatch<SetStateAction<string>>
}) => {
  const router = useRouter()
  const supabase = createClientComponentClient<Database>()
  const setComment = useSetAtom(editedCommentAtom)
  const handleSetComment = () => {
    if (!isEditMode) {
      setComment(comment.content)
      setIsEditMode(true)
      return
    }
    setIsEditMode(false)
  }

  const handleDeleteComment = async () => {
    try {
      const { error: deleteCommentError } = await supabase.from('comments').delete().eq('id', comment.id)
      if (deleteCommentError) {
        setMessage('予期せぬエラーが発生しました。' + deleteCommentError.message)
        return
      }
      router.refresh()
    } catch (error) {
      setMessage('エラーが発生しました。' + error)
      return
    }
  }
  return (
    <>
      {userId === comment.user_id && (
        <div className='flex space-x-2'>
          <IconEdit className='text-slate-500 hover:cursor-pointer hover:text-slate-700' onClick={handleSetComment} />
          <IconTrash
            className='text-slate-500 hover:cursor-pointer hover:text-slate-700'
            onClick={handleDeleteComment}
          />
        </div>
      )}
    </>
  )
}
