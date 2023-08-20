'use client'

import Link from 'next/link'

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

import { Button } from '../ui/button'
import { ErrorMessage } from '../ui/error-message'
import { Input } from '../ui/input'
import { useAuth } from './useAuth'

export const ResetPasswordForm = () => {
  const { isLoading, message, resetPassword, onHandleResetPasswordForm } = useAuth()

  return (
    <div className='space-y-10'>
      <div className='text-center'>
        <h1 className='text-2xl dark:brightness-75'>Reset Password</h1>
      </div>
      <div>
        <Form {...onHandleResetPasswordForm}>
          <form
            onSubmit={onHandleResetPasswordForm.handleSubmit(resetPassword)}
            className='flex flex-col space-y-5 rounded bg-background p-5 shadow dark:border dark:border-input dark:shadow-input'
          >
            <FormField
              control={onHandleResetPasswordForm.control}
              name='email'
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel className='dark:brightness-75'>メールアドレス</FormLabel>
                    <FormControl>
                      <Input type='email' placeholder='mail@example.com' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )
              }}
            />
            <div className='flex justify-start pt-2'>
              <Button type='submit' variant='default' disabled={isLoading}>
                送信
              </Button>
            </div>
          </form>
        </Form>
        {message && <ErrorMessage message={message} />}
      </div>
      <div className='flex flex-col items-center justify-center space-y-3 rounded bg-background p-5 text-sm shadow dark:border dark:border-input dark:shadow-input'>
        <Link
          href='/auth/login'
          className='text-card-foreground hover:text-primary hover:underline hover:underline-offset-2'
        >
          ログインはこちら
        </Link>
      </div>
    </div>
  )
}
