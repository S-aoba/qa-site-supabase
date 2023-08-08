import './globals.css'

import { Navigation } from '@/components/navigation'
import { SupabaseListener } from '@/components/supabase-listener'

export const metadata = {
  title: 'QA app',
  description: 'QA app',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='ja'>
      <body className='max-w-screen vsc-initialized flex h-screen flex-col'>
        <SupabaseListener />
        <Navigation />
        <main className='flex-1 justify-center bg-[#f5f7fa] p-5'>{children}</main>
      </body>
    </html>
  )
}
