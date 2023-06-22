import './globals.css'

import { SupabaseListener } from '@/components/supabase-listener'
import { Provider } from '@/lib/provider'

export const metadata = {
  title: 'QA app',
  description: 'QA app',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='ja'>
      <body className='max-w-screen vsc-initialized flex h-screen flex-col'>
        {/* @ts-expect-error next version of TS will fix this */}
        <SupabaseListener />
        <Provider>
          <main className='container mx-auto max-w-screen-sm flex-1 px-1 py-5'>{children}</main>
        </Provider>
      </body>
    </html>
  )
}
