'use client'

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

import { Button } from '../ui/button'
import { ErrorMessage } from '../ui/error-message'
import { Input } from '../ui/input'
import { useSettings } from './useSettings'

// パスワード変更
export const Password = () => {
  const { message, isLoading, onHandlePasswordForm, editPassword } = useSettings()

  return (
    <div className='flex w-full flex-col items-center'>
      <div className='w-full max-w-[800px] rounded border border-input bg-background p-3 shadow dark:shadow-input'>
        <div className='mb-10 text-center dark:brightness-75'>パスワード変更</div>
        <Form {...onHandlePasswordForm}>
          <form onSubmit={onHandlePasswordForm.handleSubmit(editPassword)}>
            <div className='flex flex-col space-y-2'>
              <FormField
                control={onHandlePasswordForm.control}
                name='password'
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel className='dark:brightness-75'>新しいパスワード</FormLabel>
                      <FormControl>
                        <Input placeholder='*********' type='password' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )
                }}
              />
              <FormField
                control={onHandlePasswordForm.control}
                name='confirmation'
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel className='dark:brightness-75'>確認用パスワード</FormLabel>
                      <FormControl>
                        <Input placeholder='*********' type='password' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )
                }}
              />
            </div>
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
