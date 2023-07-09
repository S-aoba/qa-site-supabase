import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { IconEdit, IconTrash } from '@tabler/icons-react'
import type { SetStateAction } from 'jotai'
import { useSetAtom } from 'jotai'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { Dispatch } from 'react'

import type { QuestionType } from '@/common/types'
import type { Database } from '@/lib/database.types'
import { editedQuestionAtom, editedQuestionContentAtom, isEditModeAtom } from '@/store/question-atom'

export const QuestionActions = ({
  userId,
  question,
  setMessage,
}: {
  userId: string | undefined
  question: QuestionType | null
  setMessage: Dispatch<SetStateAction<string>>
}) => {
  const router = useRouter()

  const setEditedQuestion = useSetAtom(editedQuestionAtom)
  const setQuestionDescription = useSetAtom(editedQuestionContentAtom)
  const setIsEditMode = useSetAtom(isEditModeAtom)
  const supabase = createClientComponentClient<Database>()
  const handleSetQuestion = () => {
    if (!question) return
    setQuestionDescription(question.content)
    setEditedQuestion({
      id: question.id,
      title: question.title,
      coding_problem: question.coding_problem,
      tags: question.tags,
    })
    setIsEditMode(true)
  }

  const handleDeleteQuestion = async () => {
    if (question === null) return
    try {
      const { error } = await supabase.from('questions').delete().eq('id', question.id)
      if (error) {
        setMessage('予期せぬエラーが発生しました。' + error.message)
        return
      }
      router.push('/')
    } catch (error) {
      setMessage('エラーが発生しました。' + error)
      return
    } finally {
      router.refresh()
    }
  }
  return (
    <>
      {userId === question?.user_id && (
        <div className='flex items-center space-x-2'>
          <Link href={'/questions/post'} className='flex items-center'>
            <IconEdit
              className='text-slate-500 hover:cursor-pointer hover:text-slate-700'
              onClick={handleSetQuestion}
            />
          </Link>
          <IconTrash
            className='text-slate-500 hover:cursor-pointer hover:text-slate-700'
            onClick={handleDeleteQuestion}
          />
        </div>
      )}
    </>
  )
}
