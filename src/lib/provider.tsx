'use client'

import { MantineProvider } from '@mantine/core'
import type { ReactNode } from 'react'

export const Provider = ({ children }: { children: ReactNode }) => {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      {children}
    </MantineProvider>
  )
}
