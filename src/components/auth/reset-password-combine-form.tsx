'use client'

import { ReloadIcon } from '@radix-ui/react-icons'

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

import { Button } from '../ui/button'
import { ErrorMessage } from '../ui/error-message'
import { Input } from '../ui/input'
import { useAuth } from './useAuth'

export const ResetPasswordCombineForm = () => {
  const { isLoading, message, resetPasswordConfirm, onHandleResetPasswordConfirmForm } = useAuth()

  return (
    <div>
      <div className='mb-10 text-center dark:brightness-75'>パスワード変更</div>
      <Form {...onHandleResetPasswordConfirmForm}>
        <form
          onSubmit={onHandleResetPasswordConfirmForm.handleSubmit(resetPasswordConfirm)}
          className='flex flex-col space-y-5 rounded bg-background p-5 shadow dark:border dark:border-input dark:shadow-input'
        >
          <FormField
            control={onHandleResetPasswordConfirmForm.control}
            name='password'
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel className='dark:brightness-75'>パスワード</FormLabel>
                  <FormControl>
                    <Input type='password' placeholder='*********' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )
            }}
          />
          <FormField
            control={onHandleResetPasswordConfirmForm.control}
            name='confirmation'
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel className='dark:brightness-75'>確認用パスワード</FormLabel>
                  <FormControl>
                    <Input type='password' placeholder='*********' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )
            }}
          />
          {message && <ErrorMessage message={message} />}
          <div className='flex justify-start pt-2'>
            <Button type='submit' variant='default' disabled={isLoading}>
              {isLoading && <ReloadIcon className='mr-2 h-4 w-4 animate-spin' />}
              {isLoading ? '更新中' : '更新'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
