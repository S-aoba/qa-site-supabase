import './globals.css'

import { Navigation } from '@/components/navigation'
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
        <Provider>
          <SupabaseListener />
          <Navigation />
          <main className='container mx-auto max-w-screen-md flex-1 px-1 py-5'>{children}</main>
        </Provider>
      </body>
    </html>
  )
}
