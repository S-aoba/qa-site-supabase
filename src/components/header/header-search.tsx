'use client'
import { TextInput } from '@mantine/core'
import { IconSearch } from '@tabler/icons-react'
import { useRouter } from 'next/navigation'
import type { ChangeEvent } from 'react'
import { type FormEvent, useState } from 'react'

import { useGetWindowSize } from '@/common/hooks/useGetWindowSize'

export const HeaderSearch = () => {
  const [searchValue, setSearchValue] = useState('')
  const router = useRouter()
  const { windowSize } = useGetWindowSize()

  const handleOnSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    router.push('/questions/search' + '?q=' + searchValue)
  }

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value)
  }

  return (
    <form onSubmit={handleOnSubmit}>
      {windowSize.width > 1023 ? (
        <TextInput
          type='text'
          autoComplete='on'
          placeholder='質問を検索'
          size='md'
          withAsterisk
          styles={{
            input: {
              border: '1px solid #cbd5e1',
              ':focus': { border: '1px solid #cbd5e1' },
            },
          }}
          onChange={handleOnChange}
        />
      ) : (
        <IconSearch className='stroke-slate-500 hover:cursor-pointer hover:stroke-slate-600' />
      )}
    </form>
  )
}
