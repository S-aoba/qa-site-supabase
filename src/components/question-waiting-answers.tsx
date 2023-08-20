import { getQuestionWaitingAnswers } from '@/common/utils/get-question-waiting-answers'
import { Card } from '@/components/ui/card'

export const QuestionWaitingAnswers = async () => {
  const { questionWaitingAnswers } = await getQuestionWaitingAnswers()
  if (questionWaitingAnswers === null) return null

  return (
    <>
      {questionWaitingAnswers.length === 0 ? (
        <div className='flex flex-col justify-center'>
          <div className='p-2 text-center'>まだ質問はありません</div>
        </div>
      ) : (
        <div className='flex flex-wrap justify-start'>
          {questionWaitingAnswers.map((questionWaitingAnswer) => {
            return (
              questionWaitingAnswer.questions && (
                <Card key={questionWaitingAnswer.questions?.id} question={questionWaitingAnswer.questions} />
              )
            )
          })}
        </div>
      )}
    </>
  )
}
