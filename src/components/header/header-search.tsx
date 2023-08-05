'use client'

import { IconSearch } from '@tabler/icons-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { z } from 'zod'

import { useWindowSize } from '@/common/hooks/useWindowSize'
import { ReactHookForm } from '@/common/react-hook-form'
import type { questionSearchSchema } from '@/common/schemas'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'

import { Input } from '../ui/input'

export const HeaderSearch = () => {
  const [isShoSearchBar, setIsShowSearchBar] = useState(false)
  const router = useRouter()

  const [width] = useWindowSize()

  const { onHandleQuestionSearchForm } = ReactHookForm()

  const handleOnSubmit = (values: z.infer<typeof questionSearchSchema>) => {
    const { q } = values
    router.push('/questions/search' + '?q=' + q)
    onHandleQuestionSearchForm.reset()
  }

  const handleShowSearchBar = () => {
    setIsShowSearchBar(!isShoSearchBar)
  }

  return (
    <Form {...onHandleQuestionSearchForm}>
      <form onSubmit={onHandleQuestionSearchForm.handleSubmit(handleOnSubmit)} className='w-full'>
        {width > 991 ? (
          <FormField
            control={onHandleQuestionSearchForm.control}
            name='q'
            render={({ field }) => {
              return (
                <FormItem>
                  <FormControl>
                    <div className='w-full pl-16'>
                      <Input type='search' autoComplete='on' required placeholder='質問を検索' {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )
            }}
          />
        ) : (
          <>
            <div className='relative flex w-full justify-end'>
              <IconSearch
                className='stroke-slate-500 hover:cursor-pointer hover:stroke-slate-600'
                onClick={handleShowSearchBar}
              />
            </div>
            {isShoSearchBar && (
              <FormField
                control={onHandleQuestionSearchForm.control}
                name='q'
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormControl>
                        <div className='absolute left-0 top-16 z-10 w-full px-5'>
                          <Input type='search' autoComplete='on' required placeholder='質問を検索' {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )
                }}
              />
            )}
          </>
        )}
      </form>
    </Form>
  )
}
