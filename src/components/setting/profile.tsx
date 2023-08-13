'use client'

import { ReloadIcon } from '@radix-ui/react-icons'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useAtomValue } from 'jotai'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import type * as z from 'zod'

import { ReactHookForm } from '@/common/react-hook-form'
import type { profileSchema } from '@/common/schemas'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import type { Database } from '@/lib/database.types'
import { profileAtom } from '@/store/profile-atom'

import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'

export const Profile = () => {
  const router = useRouter()
  const supabase = createClientComponentClient<Database>()
  const [isLoading, setLoading] = useState(false)
  const [avatar, setAvatar] = useState<File | null>(null)
  const [message, setMessage] = useState('')
  const [fileMessage, setFileMessage] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('/default.png')
  const user = useAtomValue(profileAtom)

  const { onHandleProfileForm } = ReactHookForm()

  // アバター画像の取得
  useEffect(() => {
    if (user && user.avatar_url) {
      setAvatarUrl(user.avatar_url)
    }
  }, [user])

  // 画像アップロード
  const handleOnUploadImage = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    setFileMessage('')

    // ファイルが選択されていない場合
    if (!files || files?.length == 0) {
      setFileMessage('画像をアップロードしてください。')
      return
    }

    const fileSize = files[0]?.size / 1024 / 1024 // size in MB
    const fileType = files[0]?.type // MIME type of the file

    // 画像サイズが2MBを超える場合
    if (fileSize > 2) {
      setFileMessage('画像サイズを2MB以下にする必要があります。')
      return
    }

    // ファイル形式がjpgまたはpngでない場合
    if (fileType !== 'image/jpeg' && fileType !== 'image/png') {
      setFileMessage('画像はjpgまたはpng形式である必要があります。')
      return
    }

    // 画像をセット
    setAvatar(files[0])
  }, [])

  // 送信
  const onSubmit = async (values: z.infer<typeof profileSchema>) => {
    setLoading(true)
    const { name, introduce, twitter_url, github_url, website_url } = values

    try {
      let avatar_url = user.avatar_url

      if (avatar) {
        // supabaseストレージに画像アップロード
        const { data: storageData, error: storageError } = await supabase.storage
          .from('profile')
          .upload(`${user.id}/${uuidv4()}`, avatar)

        // エラーチェック
        if (storageError) {
          setMessage('エラーが発生しました。' + storageError.message)
          return
        }

        if (avatar_url) {
          const fileName = avatar_url.split('/').slice(-1)[0]

          // 古い画像を削除
          await supabase.storage.from('profile').remove([`${user.id}/${fileName}`])
        }

        // 画像のURLを取得
        const { data: urlData } = supabase.storage.from('profile').getPublicUrl(storageData.path)

        avatar_url = urlData.publicUrl
      }

      // プロフィールアップデート
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          username: name,
          introduce: introduce,
          avatar_url,
          twitter_url: twitter_url,
          github_url: github_url,
          website_url: website_url,
        })
        .eq('id', user.id)

      // エラーチェック
      if (updateError) {
        setMessage('エラーが発生しました。' + updateError.message)
        return
      }

      setMessage('プロフィールを更新しました。')
    } catch (error) {
      setMessage('エラーが発生しました。' + error)
      return
    } finally {
      setLoading(false)
      router.refresh()
    }
  }

  return (
    <div className='flex w-full flex-col items-center'>
      <div className='w-full max-w-[800px] rounded border border-input bg-background p-3 shadow dark:shadow-input'>
        <div className='mb-10 text-center dark:brightness-75'>プロフィール</div>
        <Form {...onHandleProfileForm}>
          <form onSubmit={onHandleProfileForm.handleSubmit(onSubmit)}>
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
                <Input id='avatar' type='file' onChange={handleOnUploadImage} placeholder='画像を選択する' />
                {fileMessage && <div className='my-5 text-center text-red-500'>{fileMessage}</div>}
              </div>
            </div>
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
                  <FormItem>
                    <FormLabel className='dark:brightness-75'>自己紹介</FormLabel>
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
            <div className='mt-5'>
              <Button type='submit' variant='default' disabled={isLoading}>
                {isLoading && <ReloadIcon className='mr-2 h-4 w-4 animate-spin' />}
                {isLoading ? '変更中' : '変更'}
              </Button>
            </div>
          </form>
          {message && <div className='my-5 mb-5 text-center text-red-500'>{message}</div>}
        </Form>
      </div>
    </div>
  )
}
