import { zodResolver } from '@hookform/resolvers/zod'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import type * as z from 'zod'

import { passwordSchema } from '@/common/schemas'
import { emailSchema, loginSchema, signupSchema } from '@/common/schemas'
import type { Database } from '@/lib/database.types'

export const useAuth = () => {
  const router = useRouter()
  const supabase = createClientComponentClient<Database>()
  const [isLoading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const onHandleLoginForm = useForm({
    // 初期値
    defaultValues: { email: '', password: '' },
    // 入力値の検証
    resolver: zodResolver(loginSchema),
  })

  const onHandleSignupForm = useForm({
    // 初期値
    defaultValues: { username: '', email: '', password: '' },
    // 入力値の検証
    resolver: zodResolver(signupSchema),
  })

  const onHandleResetPasswordForm = useForm({
    // 初期値
    defaultValues: { email: '' },
    // 入力値の検証
    resolver: zodResolver(emailSchema),
  })

  const onHandleResetPasswordConfirmForm = useForm({
    // 初期値
    defaultValues: { password: '', confirmation: '' },
    // 入力値の検証
    resolver: zodResolver(passwordSchema),
  })

  const login = async (values: z.infer<typeof loginSchema>) => {
    setLoading(true)

    const { email, password } = values

    try {
      // ログイン
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      // エラーチェック
      if (error) {
        setMessage('エラーが発生しました。' + error.message)
        return
      }
      onHandleLoginForm.reset()
      router.push('/')
    } catch (error) {
      setMessage('エラーが発生しました。' + error)
      return
    } finally {
      setLoading(false)
      router.refresh()
    }
  }

  const signup = async (values: z.infer<typeof signupSchema>) => {
    setLoading(true)
    const { username, email, password } = values

    try {
      // サインアップ
      const { error: errorSignup } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${location.origin}/auth/callback`,
        },
      })

      // エラーチェック
      if (errorSignup) {
        setMessage('エラーが発生しました。' + errorSignup.message)
        return
      }
      // プロフィールの名前を更新
      const { error: updateError } = await supabase.from('profiles').update({ username }).eq('email', email)

      // エラーチェック
      if (updateError) {
        setMessage('エラーが発生しました。' + updateError.message)
        return
      }
      onHandleSignupForm.reset()
      setMessage(
        '本登録用のURLを記載したメールを送信しました。メールをご確認の上、メール本文中のURLをクリックして、本登録を行ってください。'
      )
    } catch (error) {
      setMessage('エラーが発生しました。' + error)
      return
    } finally {
      setLoading(false)
      router.refresh()
    }
  }

  const resetPassword = async (values: z.infer<typeof emailSchema>) => {
    setLoading(true)
    const { email } = values

    try {
      // パスワードリセットメールを送信
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${location.origin}/auth/reset-password/confirm`,
      })

      // エラーチェック
      if (error) {
        setMessage('エラーが発生しました。' + error.message)
        return
      }
      onHandleResetPasswordForm.reset()
      setMessage('パスワードリセットに必要なメールを送信しました。')
    } catch (error) {
      setMessage('エラーが発生しました。' + error)
      return
    } finally {
      setLoading(false)
      router.refresh()
    }
  }

  const resetPasswordConfirm = async (values: z.infer<typeof passwordSchema>) => {
    setLoading(true)
    setMessage('')
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
      onHandleResetPasswordConfirmForm.reset()
      setMessage('パスワードは正常に更新されました。')
    } catch (error) {
      setMessage('エラーが発生しました。' + error)
      return
    } finally {
      setLoading(false)
      router.push('/')
    }
  }

  return {
    router,
    supabase,
    isLoading,
    setLoading,
    message,
    setMessage,
    login,
    signup,
    resetPassword,
    resetPasswordConfirm,
    onHandleLoginForm,
    onHandleSignupForm,
    onHandleResetPasswordForm,
    onHandleResetPasswordConfirmForm,
  }
}
