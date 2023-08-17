'use client'

import { ReloadIcon } from '@radix-ui/react-icons'
import Image from 'next/image'

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { useSettings } from './useSettings'

export const Profile = () => {
  const {
    message,
    fileMessage,
    avatarUrl,
    isLoading,
    onHandleProfileForm,
    handleOnUploadImage,
    editProfile,
    inputRef,
    handleOnClickFileInput,
  } = useSettings()

  return (
    <div className='flex w-full flex-col items-center'>
      <div className='w-full max-w-[800px] rounded border border-input bg-background p-3 shadow dark:shadow-input'>
        <div className='mb-10 text-center dark:brightness-75'>プロフィール</div>
        <Form {...onHandleProfileForm}>
          <form onSubmit={onHandleProfileForm.handleSubmit(editProfile)}>
            {/* アバター画像 */}
            <div className='mb-5'>
              <div className='mb-5 flex flex-col items-center justify-center text-sm'>
                <div className='relative mb-5 h-24 w-24'>
                  <Image
                    src={avatarUrl}
                    className='rounded-full object-cover dark:brightness-75'
                    alt='avatar'
                    fill
                    sizes='auto'
                    priority
                  />
                </div>
                <Button id='avatar' type='button' onClick={handleOnClickFileInput}>
                  アイコンを変更する
                  <Input id='avatar' type='file' onChange={handleOnUploadImage} className='hidden' ref={inputRef} />
                </Button>
                {fileMessage && <div className='my-5 text-center text-red-500'>{fileMessage}</div>}
              </div>
            </div>
            <div className='flex flex-col space-y-3'>
              <FormField
                control={onHandleProfileForm.control}
                name='name'
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel className='dark:brightness-75'>名前</FormLabel>
                      <FormControl>
                        <Input placeholder='name' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )
                }}
              />
              <FormField
                control={onHandleProfileForm.control}
                name='introduce'
                render={({ field }) => {
                  return (
                    <FormItem className=''>
                      <FormLabel className='pt-2 dark:brightness-75'>自己紹介</FormLabel>
                      <FormControl>
                        <Textarea placeholder='ここに自己紹介文を記入してください' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )
                }}
              />
              <FormField
                control={onHandleProfileForm.control}
                name='twitter_url'
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel className='dark:brightness-75'>Twitter</FormLabel>
                      <FormControl>
                        <Input placeholder='twitter_url' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )
                }}
              />
              <FormField
                control={onHandleProfileForm.control}
                name='github_url'
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel className='dark:brightness-75'>Github</FormLabel>
                      <FormControl>
                        <Input placeholder='github_url' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )
                }}
              />
              <FormField
                control={onHandleProfileForm.control}
                name='website_url'
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel className='dark:brightness-75'>website</FormLabel>
                      <FormControl>
                        <Input placeholder='website_url' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )
                }}
              />
            </div>
            {message && <div className='my-5 mb-5 text-center text-red-500'>{message}</div>}
            <div className='mt-5'>
              <Button type='submit' variant='default' disabled={isLoading}>
                {isLoading && <ReloadIcon className='mr-2 h-4 w-4 animate-spin' />}
                {isLoading ? '変更中' : '変更'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}
