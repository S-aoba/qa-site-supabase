'use client'

import { ReloadIcon } from '@radix-ui/react-icons'
import Image from 'next/image'

import { FormAlert } from '@/common/form-alert'
import type { QuestionType } from '@/common/types'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'

import { Button } from '../ui/button'
import { ContentEditor } from '../ui/content-editor'
import { ErrorMessage } from '../ui/error-message'
import { useAnswer } from './useAnswer'

export const AnswerForm = ({
  userId,
  question,
  answerId,
}: {
  userId?: string
  question?: QuestionType
  answerId?: string
}) => {
  FormAlert()

  const { isLoading, message, avatarUrl, onHandleAnswerForm, editor, handleOnSubmit } = useAnswer(
    userId,
    question,
    answerId
  )

  return (
    <div
      className={`${
        answerId === undefined && 'min-h-full rounded-md bg-background p-2 shadow dark:border dark:border-input'
      }`}
    >
      {answerId === undefined && (
        <div className='flex items-center space-x-2 px-2 text-primary dark:brightness-75'>
          <div className='relative h-8 w-8'>
            <Image src={avatarUrl} className='rounded-full object-cover' alt='avatar' fill sizes='auto' priority />
          </div>
          <span>回答する</span>
        </div>
      )}
      <Form {...onHandleAnswerForm}>
        <form className='p-2' onSubmit={onHandleAnswerForm.handleSubmit(handleOnSubmit)}>
          <FormField
            control={onHandleAnswerForm.control}
            name='content'
            render={() => {
              return (
                <FormItem>
                  <FormControl>
                    <ContentEditor editor={editor} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )
            }}
          />
          <ErrorMessage message={message} />
          <div className='flex w-full justify-end px-3 pt-3'>
            {answerId === undefined ? (
              <Button type='submit' variant='default' disabled={isLoading}>
                {isLoading && <ReloadIcon className='mr-2 h-4 w-4 animate-spin' />}
                {isLoading ? '回答を送信中' : '回答を送信'}
              </Button>
            ) : (
              <Button type='submit' variant='default' disabled={isLoading}>
                {isLoading && <ReloadIcon className='mr-2 h-4 w-4 animate-spin' />}
                {isLoading ? '回答を更新中' : '回答を更新'}
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  )
}
