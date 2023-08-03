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

export const profileSchema = z.object({
  name: z.string().min(2, { message: '2文字以上入力する必要があります。' }),
  introduce: z.string().min(0),
  twitter_url: z.string().min(0),
  github_url: z.string().min(0),
  website_url: z.string().min(0),
})

export const passwordSchema = z
  .object({
    password: z.string().min(6, { message: '6文字以上入力する必要があります。' }),
    confirmation: z.string().min(6, { message: '6文字以上入力する必要があります。' }),
  })
  .refine(
    (data) => {
      return data.password === data.confirmation
    },
    {
      message: '新しいパスワードと確認用パスワードが一致しません。',
      path: ['confirmation'], // エラーメッセージが適用されるフィールド
    }
  )

 export const emailSchema = z.object({
  email: z.string().email({ message: 'メールアドレスの形式ではありません。' }),
})

export const signupSchema = z.object({
  username: z.string().min(2, { message: '2文字以上入力する必要があります。' }),
  email: z.string().email({ message: 'メールアドレスの形式ではありません。' }),
  password: z.string().min(6, { message: '6文字以上入力する必要があります。' }),
})

export const loginSchema = z.object({
  email: z.string().email({ message: 'メールアドレスの形式ではありません。' }),
  password: z.string().min(6, { message: '6文字以上入力する必要があります。' }),
})
