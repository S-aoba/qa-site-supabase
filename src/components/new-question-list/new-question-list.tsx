import { getQuestions } from '@/common/utils/get-questions'

import { Card } from '../ui/card'

export const NewQuestionList = async () => {
  const { questions } = await getQuestions()

  return (
    <>
      {questions === null ? (
        <div className='flex flex-col justify-center'>
          <div className='p-2 text-center'>まだ質問はありません</div>
        </div>
      ) : (
        <div className='flex flex-wrap justify-start'>
          {questions.map((question) => {
            return <Card key={question.id} question={question} />
          })}
        </div>
      )}
    </>
  )
}
