'use client'

import { MoonIcon, SunIcon } from '@radix-ui/react-icons'
import { useState } from 'react'

import { Toggle } from './ui/toggle'

export const Theme = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const handleToggleDarkMode = () => {
    // htmlタグにdarkクラスが含まれているかどうか
    if (document.documentElement.classList.contains('dark')) {
      // darkクラスが含まれているならライトモードに変更
      document.documentElement.classList.remove('dark')
      localStorage.theme = 'light'
      setTheme('light')
    } else {
      // darkクラスが含まれていないならダークモードに変更
      document.documentElement.classList.add('dark')
      localStorage.theme = 'dark'
      setTheme('dark')
    }
  }
  return (
    <div className='flex flex-col items-center'>
      {theme === 'dark' ? (
        <Toggle onClick={handleToggleDarkMode}>
          <SunIcon />
        </Toggle>
      ) : (
        <Toggle onClick={handleToggleDarkMode}>
          <MoonIcon />
        </Toggle>
      )}
    </div>
  )
}
