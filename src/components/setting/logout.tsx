'use client'


import { Button } from '../ui/button'
import { ErrorMessage } from '../ui/error-message'
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
              ログアウト
            </Button>
          </div>
        </form>
        <ErrorMessage message={message} />
      </div>
    </div>
  )
}
