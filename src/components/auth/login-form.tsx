'use client'

import Link from 'next/link'

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

import { Button } from '../ui/button'
import { ErrorMessage } from '../ui/error-message'
import { Input } from '../ui/input'
import { useAuth } from './useAuth'

export const LoginForm = () => {
  const { isLoading, message, login, onHandleLoginForm } = useAuth()

  return (
    <div className='space-y-10'>
      <div className='text-center'>
        <h1 className='text-2xl dark:brightness-75'>Login</h1>
      </div>
      <div>
        <Form {...onHandleLoginForm}>
          <form
            onSubmit={onHandleLoginForm.handleSubmit(login)}
            className='flex flex-col space-y-5 rounded bg-background p-5 shadow dark:border dark:border-input dark:shadow-input'
          >
            <FormField
              control={onHandleLoginForm.control}
              name='email'
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel className='dark:brightness-75'>メールアドレス</FormLabel>
                    <FormControl>
                      <Input type='email' placeholder='mail@example.com' autoComplete='email' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )
              }}
            />
            <FormField
              control={onHandleLoginForm.control}
              name='password'
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel className='dark:brightness-75'>パスワード</FormLabel>
                    <FormControl>
                      <Input type='password' placeholder='*********' autoComplete='current-password' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )
              }}
            />
            <div className='flex justify-start pt-2'>
              <Button type='submit' variant='outline' disabled={isLoading}>
                ログイン
              </Button>
            </div>
          </form>
        </Form>

        {message && <ErrorMessage message={message} />}
      </div>
      <div className='flex flex-col items-center justify-center space-y-3 rounded bg-background p-5 text-sm shadow dark:border dark:border-input dark:shadow-input'>
        <Link
          href='/auth/reset-password'
          className='text-card-foreground hover:text-primary hover:underline hover:underline-offset-2'
        >
          パスワードを忘れた方はこちら
        </Link>
        <Link
          href='/auth/signup'
          className='text-card-foreground hover:text-primary hover:underline hover:underline-offset-2'
        >
          アカウントを作成する
        </Link>
      </div>
    </div>
  )
}
