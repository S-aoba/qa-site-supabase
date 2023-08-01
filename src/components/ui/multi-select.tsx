'use client'

import { Listbox } from '@headlessui/react'
import { useState } from 'react'
import type { UseFormReturn } from 'react-hook-form'

const languages: Language[] = [
  { value: 'c', label: 'C' },
  { value: 'c++', label: 'C++' },
  { value: 'csharp', label: 'C#' },
  { value: 'java', label: 'Java' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'php', label: 'PHP' },
  { value: 'python', label: 'Python' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'swift', label: 'Swift' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'go', label: 'Go' },
  { value: 'kotlin', label: 'Kotlin' },
  { value: 'rust', label: 'Rust' },
  { value: 'react', label: 'React' },
  { value: 'next.js', label: 'Next.js' },
]

type Language = {
  value: string
  label: string
}

export const MultiSelect = ({
  handleForm,
}: {
  handleForm: UseFormReturn<
    {
      title: string
      coding_problem: string
      tags: string[]
    },
    'tags'
  >
}) => {
  // const [editedQuestion, setEditedQuestion] = useAtom(editedQuestionAtom)
  const [languageList, setLanguageList] = useState<Language[]>([])

  const handleSelect = (e: Language[]) => {
    if (languageList.length >= 5) return
    const format: string[] = e.map((item) => {
      return item.label
    })
    setLanguageList(e)
    handleForm.setValue('tags', format)
  }

  return (
    <Listbox value={languageList} onChange={handleSelect} multiple>
      <Listbox.Button className='relative flex h-14 w-full items-center justify-start space-x-3 rounded-lg border border-solid border-slate-300 bg-white px-4 text-slate-300 hover:cursor-pointer'>
        {languageList.length === 0
          ? 'タグは5個まで選択できます'
          : languageList.map((language) => {
              return (
                <span
                  key={language.label}
                  className='rounded-xl border border-solid border-slate-400 bg-[#f6f8fa] px-2 py-1 text-slate-500'
                >
                  {language.label}
                </span>
              )
            })}
      </Listbox.Button>
      <Listbox.Options className='absolute flex w-96 list-none flex-col space-y-2 rounded-lg bg-white px-3 py-2 shadow-lg z-10'>
        {languages.map((person) => {
          return (
            <Listbox.Option
              key={person.value}
              value={person}
              className='rounded-lg py-1 pl-2 hover:cursor-pointer hover:bg-slate-300'
            >
              {person.label}
            </Listbox.Option>
          )
        })}
      </Listbox.Options>
    </Listbox>
  )
}
