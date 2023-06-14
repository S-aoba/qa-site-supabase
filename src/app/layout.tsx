import './globals.css'

import { Header } from '@/components/Header'

export const metadata = {
  title: 'QA app',
  description: 'QA app',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='ja'>
      <body className='h-screen w-screen'>
        <Header />
        {children}
      </body>
    </html>
  )
}
