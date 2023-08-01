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
      <Listbox.Button className='relative flex h-14 w-full items-center justify-start space-x-3 rounded-lg border border-solid border-slate-300 bg-white px-4 text-slate-300 hover:cursor-pointer'>
        {editedQuestion.tags.length === 0
          ? 'タグは5個まで選択できます'
          : editedQuestion.tags.map((language) => {
              return (
                <span
                  key={language}
                  className='rounded-xl border border-solid border-slate-400 bg-[#f6f8fa] px-2 py-1 text-slate-500'
                >
                  {language}
                </span>
              )
            })}
      </Listbox.Button>
      <Listbox.Options className='absolute z-10 flex w-96 list-none flex-col space-y-2 rounded-lg bg-white px-3 py-2 shadow-lg'>
        {languages.map((language) => {
          return (
            <Listbox.Option
              key={language}
              value={language}
              className='rounded-lg py-1 pl-2 hover:cursor-pointer hover:bg-slate-300'
            >
              {language}
            </Listbox.Option>
          )
        })}
      </Listbox.Options>
    </Listbox>
  )
}
