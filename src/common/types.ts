import type { Database } from '@/lib/database.types'

export type QuestionType = Database['public']['Tables']['questions']['Row']
export type AnswerType = Database['public']['Tables']['answers']['Row']
