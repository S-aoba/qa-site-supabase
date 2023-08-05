'use client'
import { IconSearch } from '@tabler/icons-react'
import { useRouter } from 'next/navigation'
import type { ChangeEvent } from 'react'
import { type FormEvent, useState } from 'react'

import { useWindowSize } from '@/common/hooks/useWindowSize'

import { Input } from '../ui/input'

export const HeaderSearch = () => {
  const [searchValue, setSearchValue] = useState('')
  const router = useRouter()
  const [width] = useWindowSize()

  const handleOnSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    router.push('/questions/search' + '?q=' + searchValue)
  }

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value)
  }

  return (
    <form onSubmit={handleOnSubmit} className='w-full'>
      {width > 991 ? (
        <div className='w-full pl-16'>
          <Input type='text' autoComplete='on' placeholder='質問を検索' onChange={handleOnChange} />
        </div>
      ) : (
        <div className='flex w-full justify-end'>
          <IconSearch className='stroke-slate-500 hover:cursor-pointer hover:stroke-slate-600' />
        </div>
      )}
    </form>
  )
}
