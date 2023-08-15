import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Metadata } from 'next'
import { cookies } from 'next/headers'

import { Question } from '@/components/question/question'
import type { Database } from '@/lib/database.types'

export const generateMetadata = async ({
  params,
}: {
  params: { username: string; question_id: string }
}): Promise<Metadata> => {
  // read route params
  const question_id = params.question_id
  const supabase = createServerComponentClient<Database>({
    cookies,
  })
  const { data: question } = await supabase.from('questions').select('*, profiles(*)').eq('id', question_id).single()

  return {
    title: `${question?.title} - QA-site-supabase` ,
  }
}

const QuestionPage = async ({ params }: { params: { username: string; question_id: string } }) => {
  const supabase = createServerComponentClient<Database>({
    cookies,
  })

  // セッションの取得
  const {
    data: { session },
  } = await supabase.auth.getSession()

  return <Question session={session} question_id={params.question_id} />
}
export default QuestionPage
