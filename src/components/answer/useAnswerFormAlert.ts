'use client'

import { useAtomValue } from 'jotai'
import { useCallback, useEffect } from 'react'

import { editedAnswerAtom } from '@/store/answer-atom'

export const useAnswerFormAlert = () => {
  const content = useAtomValue(editedAnswerAtom)

  const handleBeforeUnload = useCallback(
    (e: BeforeUnloadEvent) => {
      if (content === '') return
      e.preventDefault()
      e.returnValue = ''
      return true
    },
    [content]
  )

  useEffect(() => {
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [handleBeforeUnload])
}
