import { zodResolver } from '@hookform/resolvers/zod'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useAtomValue, useSetAtom } from 'jotai'
import { useRouter } from 'next/navigation'
import type { FormEvent } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { v4 as uuidv4 } from 'uuid'
import type * as z from 'zod'

import { emailSchema, passwordSchema, profileSchema } from '@/common/schemas'
import type { Database } from '@/lib/database.types'
import { displayMainNavNameAtom } from '@/store/navigation-atom'
import { profileAtom } from '@/store/profile-atom'

export const useSettings = () => {
  const [message, setMessage] = useState('')
  const [fileMessage, setFileMessage] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('/default.png')
  const [isLoading, setLoading] = useState(false)
  const [avatar, setAvatar] = useState<File | null>(null)
  const [avatarName, setAvatarName] = useState<string>('')

  const inputRef = useRef<HTMLInputElement>(null)

  const supabase = createClientComponentClient<Database>()
  const router = useRouter()

  const user = useAtomValue(profileAtom)
  const setDisplayMainNavName = useSetAtom(displayMainNavNameAtom)

  const onHandleProfileForm = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.username ? user.username : '',
      introduce: user.introduce ? user.introduce : '',
      twitter_url: user.twitter_url ? user.twitter_url : '',
      github_url: user.github_url ? user.github_url : '',
      website_url: user.website_url ? user.website_url : '',
    },
  })

  const onHandlePasswordForm = useForm({
    // 初期値
    defaultValues: { password: '', confirmation: '' },
    // 入力値の検証
    resolver: zodResolver(passwordSchema),
  })

  const onHandleEmailForm = useForm({
    defaultValues: { email: '' },
    resolver: zodResolver(emailSchema),
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
    setAvatarName(files[0].name)
  }, [])

  // 送信
  const editProfile = async (values: z.infer<typeof profileSchema>) => {
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

  const editPassword = async (values: z.infer<typeof passwordSchema>) => {
    setLoading(true)
    const { password } = values
    try {
      // パスワードの更新
      const { error } = await supabase.auth.updateUser({
        password,
      })

      if (error) {
        setMessage('エラーが発生しました。' + error.message)
        return
      }

      setMessage('パスワードは正常に更新されました。')
    } catch (error) {
      setMessage('エラーが発生しました。' + error)
      return
    } finally {
      setLoading(false)
      onHandlePasswordForm.reset({ password: '' })
      router.refresh()
    }
  }

  const handleLogout = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      // ログアウト
      const { error } = await supabase.auth.signOut()

      // エラーチェック
      if (error) {
        setMessage('エラーが発生しました。' + error.message)
        return
      }

      router.push('/')
    } catch (error) {
      setMessage('エラーが発生しました。' + error)
      return
    } finally {
      setLoading(false)
      setDisplayMainNavName('質問')
      router.refresh()
    }
  }

  const editEmail = async (values: z.infer<typeof emailSchema>) => {
    setLoading(true)
    const { email } = values
    try {
      // メールアドレス変更メールを送信
      const { error: updateUserError } = await supabase.auth.updateUser(
        { email: email },
        { emailRedirectTo: `${location.origin}/auth/login` }
      )

      // エラーチェック
      if (updateUserError) {
        setMessage('エラーが発生しました。' + updateUserError.message)
        return
      }

      setMessage('確認用のURLを記載したメールを送信しました。')

      // ログアウト
      const { error: signOutError } = await supabase.auth.signOut()

      // エラーチェック
      if (signOutError) {
        setMessage('エラーが発生しました。' + signOutError.message)

        return
      }
      router.push('/auth/login')
    } catch (error) {
      setMessage('エラーが発生しました。' + error)
      return
    } finally {
      setLoading(false)
      onHandleEmailForm.reset({ email: '' })
      router.refresh()
    }
  }

  const handleOnClickFileInput = () => {
    inputRef.current?.click()
  }

  return {
    message,
    fileMessage,
    avatarUrl,
    isLoading,
    onHandleProfileForm,
    onHandlePasswordForm,
    onHandleEmailForm,
    handleOnUploadImage,
    editProfile,
    editPassword,
    handleLogout,
    editEmail,
    inputRef,
    handleOnClickFileInput,
    avatarName,
  }
}
