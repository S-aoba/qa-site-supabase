'use client'

import Link from 'next/link'

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

import { Button } from '../ui/button'
import { ErrorMessage } from '../ui/error-message'
import { Input } from '../ui/input'
import { useAuth } from './useAuth'

export const SignupForm = () => {
  const { isLoading, message, signup, onHandleSignupForm } = useAuth()

  return (
    <div className='space-y-10'>
      <div className='text-center'>
        <h1 className='text-2xl dark:brightness-75'>Signup</h1>
      </div>
      <div>
        <Form {...onHandleSignupForm}>
          <form
            onSubmit={onHandleSignupForm.handleSubmit(signup)}
            className='flex flex-col space-y-5 rounded bg-background p-5 shadow dark:border dark:border-input dark:shadow-input'
          >
            <FormField
              control={onHandleSignupForm.control}
              name='username'
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel className='dark:brightness-75'>ユーザーネーム</FormLabel>
                    <FormControl>
                      <Input type='text' placeholder='QA site with supabase' autoComplete='username' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )
              }}
            />
            <FormField
              control={onHandleSignupForm.control}
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
              control={onHandleSignupForm.control}
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
              <Button type='submit' variant='default' disabled={isLoading}>
                新規登録
              </Button>
            </div>
          </form>
        </Form>

        {message && <ErrorMessage message={message} />}
      </div>
      <div className='flex items-center justify-center space-x-3 rounded bg-background p-5 text-sm shadow dark:border dark:border-input dark:shadow-input'>
        <span className='text-muted-foreground'>既にアカウントはお持ちですか?</span>
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
