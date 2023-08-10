import './globals.css'

import type { ReactNode } from 'react'

import { MainNavigation } from '@/components/navigation/main-navigation'
import { SupabaseListener } from '@/components/supabase-listener'

export const metadata = {
  title: 'QA app',
  description: 'QA app',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='ja'>
      <body className='light vsc-initialized'>
        <div className='flex min-h-full flex-col'>
          <div>
            <div
              style={{
                height: `calc(100vh - 0px)`,
                maxHeight: `calc(100vh - 0px)`,
              }}
            >
              <div className='flex h-full'>
                <MainNavigation />
                <SupabaseListener />
                <main className='flex-1 justify-center border-l bg-[#f5f7fa] p-5'></main>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
