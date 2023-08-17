'use client'

import { IconSearch } from '@tabler/icons-react'

import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'

import { Input } from '../ui/input'
import { useNavigation } from './useNavigation'

export const Search = () => {
  const { onHandleQuestionSearchForm, searchQuestion, handleShowSearchBar, isShowSearchBar } = useNavigation()

  return (
    <Sheet open={isShowSearchBar} onOpenChange={handleShowSearchBar}>
      <SheetTrigger>
        <div className='rounded border border-input bg-background px-2 shadow-sm hover:cursor-pointer hover:bg-accent hover:text-accent-foreground'>
          <IconSearch className='h-5 w-5 text-muted-foreground' />
        </div>
      </SheetTrigger>
      <SheetContent side={'top'}>
        <SheetHeader>
          <SheetTitle>質問を検索する</SheetTitle>
          <SheetDescription>
            <Form {...onHandleQuestionSearchForm}>
              <form onSubmit={onHandleQuestionSearchForm.handleSubmit(searchQuestion)} className='w-full'>
                <FormField
                  control={onHandleQuestionSearchForm.control}
                  name='q'
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormControl>
                          <Input
                            type='search'
                            autoComplete='on'
                            required
                            placeholder='質問を検索'
                            {...field}
                            className='bg-background shadow shadow-input'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )
                  }}
                />
              </form>
            </Form>
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  )
}
