'use client'

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

import { Button } from '../ui/button'
import { ErrorMessage } from '../ui/error-message'
import { Input } from '../ui/input'
import { useSettings } from './useSettings'

export const Email = ({ email }: { email: string | undefined }) => {
  const { message, isLoading, onHandleEmailForm, editEmail } = useSettings()

  return (
    <div className='flex w-full flex-col items-center'>
      <div className='w-full max-w-[800px] rounded border border-input bg-background p-3 shadow dark:shadow-input'>
        <div className='mb-10 text-center dark:brightness-75'>メールアドレス変更</div>
        <Form {...onHandleEmailForm}>
          <form onSubmit={onHandleEmailForm.handleSubmit(editEmail)}>
            <div className='mb-5 dark:brightness-75'>
              <div className='mb-1'>現在のメールアドレス</div>
              <div>{email && email}</div>
            </div>

            <FormField
              control={onHandleEmailForm.control}
              name='email'
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel className='dark:brightness-75'>メールアドレス</FormLabel>
                    <FormControl>
                      <Input placeholder='email@example.com' type='email' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )
              }}
            />
            <ErrorMessage message={message} />
            <div className='mb-2 mt-5'>
              <Button type='submit' variant='default' disabled={isLoading}>
                変更
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}
