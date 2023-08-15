import { QuestionSearch } from '@/components/question/question-search'

export const metadata = {
  title: '質問検索 - QA-site-supabase',
  description: '質問検索 - QA-site-supabase',
}

const SearchPage = ({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) => {
  return <QuestionSearch q={searchParams['q']} />
}
export default SearchPage
