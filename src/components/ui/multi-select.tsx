'use client'

import { Listbox, Transition } from '@headlessui/react'
import { IconX } from '@tabler/icons-react'
import { useAtom } from 'jotai'
import Image from 'next/image'
import { Fragment } from 'react'
import type { UseFormReturn } from 'react-hook-form'

import { editedQuestionAtom } from '@/store/question-atom'

const languages: string[] = [
  'C',
  'C++',
  'Csharp',
  'Java',
  'Javascript',
  'PHP',
  'Python',
  'Ruby',
  'Swift',
  'Typescript',
  'Go',
  'Kotlin',
  'Rust',
  'React',
  'Next.js',
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

  const handleSelect = (languages: string[]) => {
    if (editedQuestion.tags.length >= 5) return
    setEditedQuestion({ ...editedQuestion, tags: languages })
    handleForm.setValue('tags', languages)
  }

  const handleDeleteLanguage = (target: string) => {
    const remainList = editedQuestion.tags.filter((lang) => {
      return lang !== target
    })
    setEditedQuestion({ ...editedQuestion, tags: remainList })
    handleForm.setValue('tags', remainList)
  }

  return (
    <Listbox value={editedQuestion.tags} onChange={handleSelect} multiple>
      <Listbox.Button className='relative flex h-9 w-full items-center justify-start space-x-3 rounded bg-background px-4 py-2 text-sm text-card-foreground shadow dark:border dark:border-border dark:shadow-border'>
        {editedQuestion.tags.length === 0 ? (
          <span className='text-muted-foreground'>タグは5個まで選択できます</span>
        ) : (
          editedQuestion.tags.map((language) => {
            return (
              <div key={language} className='flex items-center space-x-2 rounded-xl border border-border px-2 py-1'>
                <div className='relative h-4 w-4'>
                  <Image
                    src={`/lang-icon/${language}.svg`}
                    className='rounded-full object-cover'
                    alt='avatar'
                    fill
                    sizes='auto'
                    priority
                  />
                </div>
                <span>{language}</span>
                <IconX
                  size={15}
                  className='z-50 text-gray-400 hover:rounded-full hover:bg-gray-500 hover:text-white'
                  onClick={() => {
                    return handleDeleteLanguage(language)
                  }}
                />
              </div>
            )
          })
        )}
      </Listbox.Button>
      <Transition
        as={Fragment}
        enter='transition ease-out duration-200'
        enterFrom='opacity-0 translate-y-1'
        enterTo='opacity-100 translate-y-0'
        leave='transition ease-in duration-150'
        leaveFrom='opacity-100 translate-y-0'
        leaveTo='opacity-0 translate-y-1'
      >
        <Listbox.Options className='absolute z-10 flex w-96 flex-col space-y-2 rounded-lg bg-background py-2 text-sm shadow hover:cursor-default dark:border dark:border-border dark:shadow-border dark:brightness-75'>
          <div className='border-b border-input px-3 pb-3'>言語一覧</div>
          {languages.map((language) => {
            return (
              <Listbox.Option
                key={language}
                value={language}
                className='flex items-center space-x-2 rounded py-1 pl-5 hover:bg-accent hover:text-accent-foreground'
              >
                <div className='relative h-4 w-4'>
                  <Image
                    src={`/lang-icon/${language}.svg`}
                    className='rounded-full object-cover'
                    alt='avatar'
                    fill
                    sizes='auto'
                    priority
                  />
                </div>
                <span>{language}</span>
              </Listbox.Option>
            )
          })}
        </Listbox.Options>
      </Transition>
    </Listbox>
  )
}
