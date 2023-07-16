'use client'

import { useAtomValue } from 'jotai'
import { useEffect } from 'react'

import { editedAnswerAtom } from '@/store/answer-atom'

export const useAnswerFormAlert = () => {
  const content = useAtomValue(editedAnswerAtom)

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (content === '') return
      e.preventDefault()
      e.returnValue = ''
      return true
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [content])
}
