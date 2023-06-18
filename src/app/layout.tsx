import './globals.css'

import { SupabaseListener } from '@/components/supabase-listener'

export const metadata = {
  title: 'QA app',
  description: 'QA app',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='ja'>
      <body className='max-w-screen flex h-screen flex-col'>
        {/* @ts-expect-error next version of TS will fix this */}
        <SupabaseListener />
        {children}
      </body>
    </html>
  )
}
