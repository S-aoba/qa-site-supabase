import { QuestionSearch } from '@/components/question/question-search'

const SearchPage = ({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) => {
  return <QuestionSearch q={searchParams['q']} />
}
export default SearchPage
