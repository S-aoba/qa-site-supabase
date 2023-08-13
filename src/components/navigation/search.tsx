'use client'

import { IconSearch } from '@tabler/icons-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { z } from 'zod'

import { ReactHookForm } from '@/common/react-hook-form'
import type { questionSearchSchema } from '@/common/schemas'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

import { Input } from '../ui/input'

export const Search = () => {
  const [isShowSearchBar, setIsShowSearchBar] = useState(false)
  const router = useRouter()

  const { onHandleQuestionSearchForm } = ReactHookForm()

  const handleOnSubmit = (values: z.infer<typeof questionSearchSchema>) => {
    const { q } = values
    router.push('/questions/search' + '?q=' + q)
    onHandleQuestionSearchForm.reset()
    setIsShowSearchBar(false)
  }

  const handleShowSearchBar = () => {
    setIsShowSearchBar(!isShowSearchBar)
  }

  return (
    <Form {...onHandleQuestionSearchForm}>
      <form onSubmit={onHandleQuestionSearchForm.handleSubmit(handleOnSubmit)} className='w-full'>
        <div className='relative flex w-full justify-end'>
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className='rounded border border-input bg-background px-2 shadow-sm hover:cursor-pointer hover:bg-accent hover:text-accent-foreground'>
                  <IconSearch className='h-5 w-5 text-muted-foreground' onClick={handleShowSearchBar} />
                </div>
              </TooltipTrigger>
              <TooltipContent side='left' sideOffset={10} align='start'>
                <p>検索</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        {isShowSearchBar && (
          <FormField
            control={onHandleQuestionSearchForm.control}
            name='q'
            render={({ field }) => {
              return (
                <FormItem>
                  <FormControl>
                    <div className='absolute left-0 top-16 z-10 w-full px-5'>
                      <Input type='search' autoComplete='on' required placeholder='質問を検索' {...field} className='shadow shadow-input bg-background'/>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )
            }}
          />
        )}
      </form>
    </Form>
  )
}
