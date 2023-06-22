import { atom } from 'jotai'

import type { QuestionType } from '@/common/types'

type EditedQuestionType = Omit<QuestionType, 'created_at' | 'updated_at'>

export const editedQuestionAtom = atom<EditedQuestionType>({
  id: '',
  user_id: '',
  title: '',
  description: '',
  tags: [],
  coding_problem: '',
})

export const editedQuestionDescriptionAtom = atom<string>('')
