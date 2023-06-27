import { atom } from 'jotai'

import type { QuestionType } from '@/common/types'

type EditedQuestionType = Pick<QuestionType, 'id' | 'title' | 'tags' | 'coding_problem'>
type EditType = { question: boolean; answer: boolean }

export const editedQuestionAtom = atom<EditedQuestionType>({
  id: '',
  title: '',
  tags: [],
  coding_problem: '',
})

export const editedQuestionContentAtom = atom<string>('')

export const isEditModeAtom = atom<EditType>({ question: false, answer: false })
