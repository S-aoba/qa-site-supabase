import { atom } from 'jotai'

import type { QuestionType } from '@/common/types'

type EditedQuestionType = Pick<QuestionType, 'title' | 'tags' | 'coding_problem'>
type EditType = { question: boolean; answer: boolean }

export const editedQuestionAtom = atom<EditedQuestionType>({
  title: '',
  tags: [],
  coding_problem: '',
})

export const editedQuestionDescriptionAtom = atom<string>('')

export const isEditModeAtom = atom<EditType>({ question: false, answer: false })
