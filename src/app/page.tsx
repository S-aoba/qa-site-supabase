import { NewQuestionList } from '@/components/new-question-list/new-question-list'

export const metadata = {
  title: '新着質問一覧 - QA-site-supabase',
  description: '新着質問一覧 - QA-site-supabase',
}

export default function Home() {
  return <NewQuestionList />
}
