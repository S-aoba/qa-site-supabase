import { atom } from 'jotai'

import type { Database } from '@/lib/database.types'

type QuestionType = Database['public']['Tables']['questions']['Row']
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
