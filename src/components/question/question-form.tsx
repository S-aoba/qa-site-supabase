'use client'

import { FormAlert } from '@/common/form-alert'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'

import { Button } from '../ui/button'
import { ContentEditor } from '../ui/content-editor'
import { ErrorMessage } from '../ui/error-message'
import { Input } from '../ui/input'
import { MultiSelect } from '../ui/multi-select'
import { Select } from '../ui/select'
import { useQuestion } from './useQuestion'

export const QuestionForm = ({ userId }: { userId: string }) => {
  FormAlert()
  const { isLoading, editor, message, onHandleQuestionForm, editedQuestion, submit } = useQuestion(userId)

  return (
    <div className='container mx-auto'>
      <Form {...onHandleQuestionForm}>
        <form className='flex flex-col justify-center gap-y-7' onSubmit={onHandleQuestionForm.handleSubmit(submit)}>
          <FormField
            control={onHandleQuestionForm.control}
            name='title'
            render={({ field }) => {
              return (
                <FormItem>
                  <FormControl>
                    <Input className='text-card-foreground' placeholder='タイトル' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )
            }}
          />
          <FormField
            control={onHandleQuestionForm.control}
            name='coding_problem'
            render={() => {
              return (
                <FormItem>
                  <FormControl>
                    <Select handleForm={onHandleQuestionForm} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )
            }}
          />
          <FormField
            control={onHandleQuestionForm.control}
            name='tags'
            render={() => {
              return (
                <FormItem>
                  <FormControl>
                    <MultiSelect handleForm={onHandleQuestionForm} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )
            }}
          />
          <FormField
            control={onHandleQuestionForm.control}
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
          <div className='flex w-full justify-end px-3'>
            <Button type='submit' variant='default' disabled={isLoading}>
              {editedQuestion.id === '' ? '質問を投稿' : '質問を更新'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
