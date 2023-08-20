'use client'

import Image from 'next/image'

import { FormAlert } from '@/common/form-alert'
import type { AnswerType } from '@/common/types'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'

import { Button } from '../ui/button'
import { ContentEditor } from '../ui/content-editor'
import { ErrorMessage } from '../ui/error-message'
import { useComment } from './useComment'

export const CommentForm = ({ answer, commentId }: { answer?: AnswerType; commentId?: string }) => {
  FormAlert()

  const { message, isLoading, avatarUrl, onHandleCommentForm, editor, handleOnSubmit } = useComment(answer, commentId)

  return (
    <div className={`${commentId === undefined && 'border-t'} p-2`}>
      {commentId === undefined && (
        <div className='flex items-center space-x-2 px-2 text-primary dark:brightness-75'>
          <div className='relative h-8 w-8'>
            <Image src={avatarUrl} className='rounded-full object-cover' alt='avatar' fill sizes='auto' priority />
          </div>
          <span className=''>コメントする</span>
        </div>
      )}
      <Form {...onHandleCommentForm}>
        <form className='p-2' onSubmit={onHandleCommentForm.handleSubmit(handleOnSubmit)}>
          <FormField
            control={onHandleCommentForm.control}
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
            <Button type='submit' variant='default' disabled={isLoading}>
              {commentId === undefined ? 'コメントを投稿' : 'コメントを更新'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
