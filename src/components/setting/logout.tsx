'use client'

import { ReloadIcon } from '@radix-ui/react-icons'

import { Button } from '../ui/button'
import { useSettings } from './useSettings'

// ログアウト
export const Logout = () => {
  const { message, isLoading, handleLogout } = useSettings()

  return (
    <div className='flex w-full flex-col items-center'>
      <div className='w-full max-w-[800px] rounded border border-input bg-background p-3 shadow dark:border-input'>
        <div className='mb-5 text-center dark:brightness-75'>ログアウトしますか？</div>
        {/* ログアウトボタン */}
        <form onSubmit={handleLogout}>
          <div className='mb-5'>
            <Button type='submit' variant='destructive' disabled={isLoading}>
              {isLoading && <ReloadIcon className='mr-2 h-4 w-4 animate-spin' />}
              {isLoading ? 'ログアウト中' : 'ログアウト'}
            </Button>
          </div>
        </form>
        {message && <div className='my-5 text-center text-sm text-red-500'>{message}</div>}
      </div>
    </div>
  )
}
