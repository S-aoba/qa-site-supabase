'use client'

import { IconSearch } from '@tabler/icons-react'

import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

import { Input } from '../ui/input'
import { useNavigation } from './useNavigation'

export const Search = () => {
  const { onHandleQuestionSearchForm, searchQuestion, handleShowSearchBar, isShowSearchBar } = useNavigation()

  return (
    <Form {...onHandleQuestionSearchForm}>
      <form onSubmit={onHandleQuestionSearchForm.handleSubmit(searchQuestion)} className='w-full'>
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
                      <Input
                        type='search'
                        autoComplete='on'
                        required
                        placeholder='質問を検索'
                        {...field}
                        className='bg-background shadow shadow-input'
                      />
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
