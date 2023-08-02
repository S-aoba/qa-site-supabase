import * as z from 'zod'

export const questionSchema = z.object({
  title: z
    .string()
    .min(1, { message: '質問タイトルを1文字以上入力してください' })
    .max(100, { message: '100文字以上入力できません' }),
  coding_problem: z.string().min(1, { message: '問題を1つ選択してください' }),
  tags: z.string().array().min(1, { message: 'タグを1つ以上選択してください' }),
  content: z.string().min(1, { message: '1文字以上入力してください' }),
})

export const answerSchema = z.object({
  content: z.string().min(1, { message: '1文字以上入力してください' }),
})

export const commentSchema = z.object({
  content: z.string().min(1, { message: '1文字以上入力してください' }),
})
