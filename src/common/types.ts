import type { Database } from '@/lib/database.types'

export type QuestionType = Database['public']['Tables']['questions']['Row']
export type AnswerType = Database['public']['Tables']['answers']['Row']
export type NotificationType = Database['public']['Tables']['notifications']['Row']
export type CommentType = Database['public']['Tables']['comments']['Row']
export type ProfileType = Database['public']['Tables']['profiles']['Row']
export type TagType = {
  value: string
  label: string
}
export type ActionProps = {
  question?: QuestionType
  answer?: AnswerType
  comment?: CommentType
}
