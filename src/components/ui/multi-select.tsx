'use client'

import { Listbox } from '@headlessui/react'
import { useAtom } from 'jotai'
import type { UseFormReturn } from 'react-hook-form'

import { editedQuestionAtom } from '@/store/question-atom'

const languages: string[] = [
  'c',
  'c++',
  'csharp',
  'java',
  'javascript',
  'php',
  'python',
  'ruby',
  'swift',
  'typescript',
  'go',
  'kotlin',
  'rust',
  'react',
  'next.js',
]

export const MultiSelect = ({
  handleForm,
}: {
  handleForm: UseFormReturn<
    {
      title: string
      coding_problem: string
      tags: string[]
      content: string
    },
    'tags'
  >
}) => {
  const [editedQuestion, setEditedQuestion] = useAtom(editedQuestionAtom)

  const handleSelect = (language: string[]) => {
    if (editedQuestion.tags.length >= 5) return
    setEditedQuestion({ ...editedQuestion, tags: language })
    handleForm.setValue('tags', language)
  }

  return (
    <Listbox value={editedQuestion.tags} onChange={handleSelect} multiple>
      <Listbox.Button className='relative flex h-9 w-full items-center justify-start space-x-3 rounded bg-background px-4 py-2 text-sm font-medium text-card-foreground shadow hover:cursor-pointer dark:border dark:border-border dark:shadow-border'>
        {editedQuestion.tags.length === 0 ? (
          <span className='text-muted-foreground'>タグは5個まで選択できます</span>
        ) : (
          editedQuestion.tags.map((language) => {
            return (
              <span key={language} className='rounded border bg-foreground px-2 py-1 text-background'>
                {language}
              </span>
            )
          })
        )}
      </Listbox.Button>
      <Listbox.Options className='absolute z-10 flex w-96 flex-col space-y-2 rounded-lg bg-background px-3 py-2 shadow dark:border dark:border-border dark:shadow-border dark:brightness-75'>
        {languages.map((language) => {
          return (
            <Listbox.Option
              key={language}
              value={language}
              className='rounded py-1 pl-2 hover:cursor-pointer hover:bg-accent hover:text-accent-foreground'
            >
              {language}
            </Listbox.Option>
          )
        })}
      </Listbox.Options>
    </Listbox>
  )
}
