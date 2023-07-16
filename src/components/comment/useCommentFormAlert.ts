import { useAtomValue } from 'jotai'
import { useEffect } from 'react'

import { editedCommentAtom } from '@/store/comment-atom'

export const useCommentFormAlert = () => {
  const comment = useAtomValue(editedCommentAtom)

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (comment === '') return
      e.preventDefault()
      e.returnValue = ''
      return true
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [comment])
}
