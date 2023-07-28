'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Textarea } from '@mantine/core'
import { ReloadIcon } from '@radix-ui/react-icons'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useAtomValue } from 'jotai'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import type { SubmitHandler } from 'react-hook-form'
import { useForm } from 'react-hook-form'
import { v4 as uuidv4 } from 'uuid'
import * as z from 'zod'

import type { Database } from '@/lib/database.types'
import { profileAtom } from '@/store/profile-atom'

import { Button } from '../ui/button'
import { Input } from '../ui/input'

type Schema = z.infer<typeof schema>

// 入力データの検証ルールを定義
const schema = z.object({
  name: z.string().min(2, { message: '2文字以上入力する必要があります。' }),
  introduce: z.string().min(0),
  twitter_url: z.string().min(0),
  github_url: z.string().min(0),
  website_url: z.string().min(0),
})

// プロフィール
export const Profile = () => {
  const router = useRouter()
  const supabase = createClientComponentClient<Database>()
  const [isLoading, setLoading] = useState(false)
  const [avatar, setAvatar] = useState<File | null>(null)
  const [message, setMessage] = useState('')
  const [fileMessage, setFileMessage] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('/default.png')
  const user = useAtomValue(profileAtom)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    // 初期値
    defaultValues: {
      name: user.username ? user.username : '',
      introduce: user.introduce ? user.introduce : '',
      twitter_url: user.twitter_url ? user.twitter_url : '',
      github_url: user.github_url ? user.github_url : '',
      website_url: user.website_url ? user.website_url : '',
    },
    // 入力値の検証
    resolver: zodResolver(schema),
  })

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
  const onSubmit: SubmitHandler<Schema> = async (data) => {
    setLoading(true)
    setMessage('')

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
          username: data.name,
          introduce: data.introduce,
          avatar_url,
          twitter_url: data.twitter_url,
          github_url: data.github_url,
          website_url: data.website_url,
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
    <div>
      <div className='mb-10 text-center text-xl font-bold'>プロフィール</div>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* アバター画像 */}
        <div className='mb-5'>
          <div className='mb-5 flex flex-col items-center justify-center text-sm'>
            <div className='relative mb-5 h-24 w-24'>
              <Image src={avatarUrl} className='rounded-full object-cover' alt='avatar' fill sizes='auto' priority />
            </div>
            <Input id='avatar' type='file' onChange={handleOnUploadImage} placeholder='画像を選択する' />
            {fileMessage && <div className='my-5 text-center text-red-500'>{fileMessage}</div>}
          </div>
        </div>

        {/* 名前 */}
        <div className='mb-5'>
          <div className='mb-1 text-sm font-bold'>名前</div>
          <Input id='name' type='text' placeholder='名前' {...register('name', { required: true })} required />
          <div className='my-3 text-center text-sm text-red-500'>{errors.name?.message}</div>
        </div>

        {/* 自己紹介 */}
        <div className='mb-5'>
          <div className='mb-1 text-sm font-bold'>自己紹介</div>
          <Textarea
            styles={{
              input: {
                border: '1px solid #cbd5e1',
                ':focus': { border: '1px solid #cbd5e1' },
              },
            }}
            placeholder='自己紹介'
            id='introduce'
            {...register('introduce')}
            rows={5}
          />
        </div>

        {/* Twitter */}
        <div className='mb-5'>
          <div className='mb-1 text-sm font-bold'>Twitter</div>
          <Input id='twitter_url' type='text' placeholder='URL' {...register('twitter_url')} />
          <div className='my-3 text-center text-sm text-red-500'>{errors.name?.message}</div>
        </div>

        {/* Github */}
        <div className='mb-5'>
          <div className='mb-1 text-sm font-bold'>Github</div>
          <Input id='github_url' type='text' placeholder='URL' {...register('github_url')} />
          <div className='my-3 text-center text-sm text-red-500'>{errors.name?.message}</div>
        </div>

        {/* Website */}
        <div className='mb-5'>
          <div className='mb-1 text-sm font-bold'>Website</div>
          <Input id='website_url' type='text' placeholder='URL' {...register('website_url')} />
          <div className='my-3 text-center text-sm text-red-500'>{errors.name?.message}</div>
        </div>

        {/* 変更ボタン */}
        <div className='mb-5'>
          <Button type='submit' variant='default' disabled={isLoading}>
            {isLoading && <ReloadIcon className='mr-2 h-4 w-4 animate-spin' />}
            {isLoading ? '変更中' : '変更'}
          </Button>
        </div>
      </form>

      {/* メッセージ */}
      {message && <div className='my-5 mb-5 text-center text-red-500'>{message}</div>}
    </div>
  )
}
