import './globals.css'

import type { ReactNode } from 'react'

import { SupabaseListener } from '@/components/supabase-listener'

export const metadata = {
  title: 'QA app',
  description: 'QA app',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='ja'>
      <body className='dark vsc-initialized'>
        <div className='flex h-screen min-h-screen flex-col'>
          <div className='flex h-fit'>
            <SupabaseListener />
            <main className='h-fit min-h-full w-full flex-1 bg-main-foreground p-5'>{children}</main>
          </div>
        </div>
      </body>
    </html>
  )
}
