import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import type { Dispatch, SetStateAction } from 'react'

import { useAction } from '@/common/hooks/useAction'
import type { CommentType } from '@/common/types'
import type { Database } from '@/lib/database.types'

export const useComment = (setIsLoading: Dispatch<SetStateAction<boolean>>) => {
  const router = useRouter()
  const supabase = createClientComponentClient<Database>()

  const { isEditCommentMode, setComment, setIsEditCommentMode, setMessage, handleHideDialog } = useAction()

  const handleSetComment = (comment: CommentType) => {
    if (!isEditCommentMode) {
      setComment(comment.content)
      setIsEditCommentMode(true)
      return
    }
    setIsEditCommentMode(false)
  }

  const handleDeleteComment = async (comment: CommentType) => {
    setIsLoading(true)
    try {
      const { error: deleteCommentError } = await supabase.from('comments').delete().eq('id', comment.id)
      if (deleteCommentError) {
        setMessage('予期せぬエラーが発生しました。' + deleteCommentError.message)
        return
      }
    } catch (error) {
      setMessage('エラーが発生しました。' + error)
      return
    } finally {
      setIsLoading(false)
      handleHideDialog()
      router.refresh()
    }
  }
  return { handleDeleteComment, handleSetComment }
}
